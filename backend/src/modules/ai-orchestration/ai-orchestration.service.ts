import { AIOrchestrationError } from "./ai-orchestration.errors";
import type {
  AIUserContext, AIOperationType, AIProposal, AIProposalSelection,
  AIProposalApplicationResult, AIRequestContext, AIProviderRequest,
} from "./ai-orchestration.types";
import type {
  AIContextReader, AIOrchestrationRules, AIOutputValidator, AIProposalDomainApplier,
  AIProposalRepository, AIProvider,
  AIUsageReservation,
} from "./ai-orchestration.repository";
import { validateAIRequest, validateProviderResponse } from "./ai-orchestration.validation";

const PROPOSAL_OPERATIONS: Partial<Record<AIOperationType, "GOAL_TREE" | "DAILY_PLAN">> = {
  GOAL_TREE_PROPOSAL: "GOAL_TREE",
  DAILY_PLAN_PROPOSAL: "DAILY_PLAN",
};

export class AIOrchestrationService {
  constructor(
    private readonly contextReader: AIContextReader,
    private readonly provider: AIProvider,
    private readonly outputValidator: AIOutputValidator,
    private readonly proposals: AIProposalRepository,
    private readonly domainApplier: AIProposalDomainApplier,
    private readonly rules: AIOrchestrationRules,
    private readonly usage?: AIUsageReservation,
  ) {}

  async execute(
    user: AIUserContext,
    operation: AIOperationType,
    userInput: string,
    references?: unknown,
  ): Promise<unknown> {
    this.assertAuthenticated(user);
    const context = await this.loadContext(user.userId, operation, userInput, references);
    if (this.usage && !this.usage.reserve(user.userId)) {
      throw new AIOrchestrationError("AI_USAGE_LIMIT_EXCEEDED", "The daily AI usage limit has been reached. Continue manually or try again tomorrow.");
    }
    const providerRequest: AIProviderRequest = {
      operationType: operation,
      input: userInput,
      context: {
        goalContext: context.goalContext,
        projectContext: context.projectContext,
        actionContext: context.actionContext,
        measurementContext: context.measurementContext,
        planningContext: context.planningContext,
        progressContext: context.progressContext,
        constraints: context.constraints,
      },
      outputSchemaKey: operation,
    };

    let response;
    try {
      response = await this.provider.generate(providerRequest);
    } catch (error) {
      throw this.normalizeProviderError(error);
    }
    validateProviderResponse(response);

    const validation = await this.outputValidator.validate(operation, response.content);
    if (!validation.valid) {
      throw new AIOrchestrationError(
        "AI_OUTPUT_SEMANTIC_INVALID",
        "AI output did not pass the configured structural and semantic validation.",
      );
    }

    const proposalType = PROPOSAL_OPERATIONS[operation];
    if (!proposalType) return validation.value;

    if (!this.rules.proposalPersistenceEnabled) {
      throw new AIOrchestrationError(
        "AI_PERSISTENCE_ERROR",
        "Proposal persistence is disabled until its model and lifecycle are approved.",
      );
    }

    const now = this.rules.now();
    const proposal: AIProposal = {
      id: this.rules.createProposalId(),
      userId: user.userId,
      operationType: operation,
      proposalType,
      status: "PENDING_REVIEW",
      proposalData: validation.value,
      createdAt: now,
      updatedAt: now,
    };
    try {
      return await this.proposals.create(proposal);
    } catch (error) {
      throw new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to save AI proposal.", error);
    }
  }

  async getProposal(user: AIUserContext, proposalId: string): Promise<AIProposal> {
    this.assertAuthenticated(user);
    const proposal = await this.proposals.getById(proposalId);
    if (!proposal) throw new AIOrchestrationError("AI_PROPOSAL_NOT_FOUND", "Proposal was not found.");
    if (proposal.userId !== user.userId) throw new AIOrchestrationError("AI_PROPOSAL_ACCESS_DENIED", "Proposal access denied.");
    return proposal;
  }

  async updateProposal(
    user: AIUserContext,
    proposalId: string,
    proposalData: unknown,
  ): Promise<AIProposal> {
    const current = await this.getProposal(user, proposalId);
    if (!["PENDING_REVIEW", "EDITED"].includes(current.status)) {
      throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal cannot be edited in its current state.");
    }
    const updated: AIProposal = {
      ...current,
      proposalData,
      status: "EDITED",
      updatedAt: this.rules.now(),
    };
    try {
      return await this.proposals.update(updated, current.status);
    } catch (error) {
      throw new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to update proposal.", error);
    }
  }

  async rejectProposal(user: AIUserContext, proposalId: string): Promise<AIProposal> {
    const current = await this.getProposal(user, proposalId);
    if (!["PENDING_REVIEW", "EDITED", "PARTIALLY_APPROVED", "FAILED"].includes(current.status)) {
      throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal cannot be rejected in its current state.");
    }
    return this.saveProposal({ ...current, status: "REJECTED", updatedAt: this.rules.now() }, current.status);
  }

  async approveAndApplyProposal(
    user: AIUserContext,
    proposalId: string,
    selection: AIProposalSelection,
  ): Promise<AIProposalApplicationResult> {
    const current = await this.getProposal(user, proposalId);
    if (!["PENDING_REVIEW", "EDITED", "PARTIALLY_APPROVED", "FAILED"].includes(current.status)) {
      if (current.status === "APPLIED") throw new AIOrchestrationError("AI_PROPOSAL_ALREADY_APPLIED", "Proposal has already been applied.");
      throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal is not eligible for approval.");
    }
    if (!selection || !Array.isArray(selection.selectedItemIds) || selection.selectedItemIds.length === 0) {
      throw new AIOrchestrationError("AI_APPROVAL_REQUIRED", "An explicit item selection is required.");
    }

    const previous = current.proposalData as { applicationResults?: AIProposalApplicationResult["operations"] };
    const previouslyApplied = new Set((previous?.applicationResults ?? [])
      .filter((item) => item.success).map((item) => item.operation));
    if (selection.selectedItemIds.some((id) => previouslyApplied.has(id))) {
      throw new AIOrchestrationError("AI_PROPOSAL_ALREADY_APPLIED", "Previously applied proposal items cannot be applied twice.");
    }

    try {
      await this.domainApplier.validateProposal(user.userId, current, selection);
    } catch (error) {
      throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Approved proposal items failed domain validation.", error);
    }

    const claimed = await this.proposals.claimForApplication(current.id, user.userId, this.rules.now());
    if (!claimed) throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal application is already running or no longer available.");

    let result: AIProposalApplicationResult;
    try {
      result = await this.domainApplier.applyApprovedProposal(user.userId, current, selection);
    } catch (error) {
      await this.saveProposal({ ...current, status: previouslyApplied.size ? "PARTIALLY_APPROVED" : "FAILED", updatedAt: this.rules.now() }, "APPLYING");
      throw new AIOrchestrationError("AI_PROPOSAL_APPLICATION_FAILED", "Applying approved proposal failed.", error);
    }
    const combined = [...(previous?.applicationResults ?? []), ...result.operations];
    const allItemIds = Array.isArray((current.proposalData as { items?: unknown[] })?.items)
      ? (current.proposalData as { items: { id: string }[] }).items.map((item) => item.id) : [];
    const complete = allItemIds.length > 0 && allItemIds.every((id) => combined.some((item) => item.operation === id && item.success));
    const hasSuccess = combined.some((item) => item.success);
    const nextStatus = complete ? "APPLIED" : hasSuccess ? "PARTIALLY_APPROVED" : "FAILED";
    await this.saveProposal({
      ...current, status: nextStatus,
      proposalData: { ...(current.proposalData as Record<string, unknown>), applicationResults: combined },
      updatedAt: this.rules.now(),
    }, "APPLYING");
    return { ...result, status: complete ? "APPLIED" : hasSuccess ? "PARTIALLY_APPLIED" : "FAILED", operations: combined };
  }

  private async loadContext(
    userId: string,
    operation: AIOperationType,
    userInput: string,
    references?: unknown,
  ): Promise<AIRequestContext> {
    try {
      const context = await this.contextReader.buildContext(userId, operation, userInput, references);
      validateAIRequest(context, this.rules.validation);
      if (context.userId !== userId || context.operationType !== operation) {
        throw new AIOrchestrationError("AI_CONTEXT_ACCESS_DENIED", "Context does not match the authenticated user or operation.");
      }
      return context;
    } catch (error) {
      if (error instanceof AIOrchestrationError) throw error;
      throw new AIOrchestrationError("AI_CONTEXT_NOT_FOUND", "Unable to build authorized AI context.", error);
    }
  }

  private async saveProposal(proposal: AIProposal, expectedStatus?: AIProposal["status"]): Promise<AIProposal> {
    try { return await this.proposals.update(proposal, expectedStatus); }
    catch (error) { throw new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to update proposal state.", error); }
  }

  private assertAuthenticated(user: AIUserContext): void {
    if (!user?.isAuthenticated || !user.userId) {
      throw new AIOrchestrationError("AI_UNAUTHENTICATED", "Authentication is required.");
    }
  }

  private normalizeProviderError(error: unknown): AIOrchestrationError {
    if (error instanceof AIOrchestrationError) return error;
    const candidate = error as { code?: string; status?: number; name?: string };
    if (candidate?.code === "TIMEOUT" || candidate?.name === "TimeoutError") {
      return new AIOrchestrationError("AI_REQUEST_TIMEOUT", "AI provider request timed out.", error);
    }
    if (candidate?.status === 429) {
      return new AIOrchestrationError("AI_PROVIDER_RATE_LIMITED", "AI provider rate limit reached.", error);
    }
    if (candidate?.status === 401 || candidate?.status === 403) {
      return new AIOrchestrationError("AI_PROVIDER_AUTH_FAILED", "AI provider authentication failed.", error);
    }
    if (candidate?.status === 503 || candidate?.status === 502) {
      return new AIOrchestrationError("AI_PROVIDER_UNAVAILABLE", "AI provider is unavailable.", error);
    }
    return new AIOrchestrationError("AI_PROVIDER_ERROR", "AI provider request failed.", error);
  }
}
