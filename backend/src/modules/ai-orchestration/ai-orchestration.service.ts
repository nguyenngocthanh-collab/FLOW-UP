import { AIOrchestrationError } from "./ai-orchestration.errors";
import type {
  AIUserContext, AIOperationType, AIProposal, AIProposalSelection,
  AIProposalApplicationResult, AIRequestContext, AIProviderRequest,
} from "./ai-orchestration.types";
import type {
  AIContextReader, AIOrchestrationRules, AIOutputValidator, AIProposalDomainApplier,
  AIProposalRepository, AIProvider,
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
  ) {}

  async execute(
    user: AIUserContext,
    operation: AIOperationType,
    userInput: string,
    references?: unknown,
  ): Promise<unknown> {
    this.assertAuthenticated(user);
    const context = await this.loadContext(user.userId, operation, userInput, references);
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
      return await this.proposals.update(updated);
    } catch (error) {
      throw new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to update proposal.", error);
    }
  }

  async rejectProposal(user: AIUserContext, proposalId: string): Promise<AIProposal> {
    const current = await this.getProposal(user, proposalId);
    if (!["PENDING_REVIEW", "EDITED"].includes(current.status)) {
      throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal cannot be rejected in its current state.");
    }
    return this.saveProposal({ ...current, status: "REJECTED", updatedAt: this.rules.now() });
  }

  async approveAndApplyProposal(
    user: AIUserContext,
    proposalId: string,
    selection: AIProposalSelection,
  ): Promise<AIProposalApplicationResult> {
    const current = await this.getProposal(user, proposalId);
    if (!["PENDING_REVIEW", "EDITED"].includes(current.status)) {
      if (current.status === "APPLIED") throw new AIOrchestrationError("AI_PROPOSAL_ALREADY_APPLIED", "Proposal has already been applied.");
      throw new AIOrchestrationError("AI_PROPOSAL_INVALID_STATE", "Proposal is not eligible for approval.");
    }
    if (!selection || !Array.isArray(selection.selectedItemIds)) {
      throw new AIOrchestrationError("AI_APPROVAL_REQUIRED", "An explicit item selection is required.");
    }

    try {
      await this.domainApplier.validateProposal(user.userId, current, selection);
    } catch (error) {
      throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Approved proposal items failed domain validation.", error);
    }

    let result: AIProposalApplicationResult;
    try {
      result = await this.domainApplier.applyApprovedProposal(user.userId, current, selection);
    } catch (error) {
      throw new AIOrchestrationError("AI_PROPOSAL_APPLICATION_FAILED", "Applying approved proposal failed.", error);
    }

    const nextStatus = result.status === "APPLIED"
      ? "APPLIED"
      : result.status === "PARTIALLY_APPLIED"
        ? "PARTIALLY_APPROVED"
        : "FAILED";
    await this.saveProposal({ ...current, status: nextStatus, updatedAt: this.rules.now() });
    return result;
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

  private async saveProposal(proposal: AIProposal): Promise<AIProposal> {
    try { return await this.proposals.update(proposal); }
    catch (error) { throw new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to update proposal state.", error); }
  }

  private assertAuthenticated(user: AIUserContext): void {
    if (!user?.isAuthenticated || !user.userId) {
      throw new AIOrchestrationError("AI_UNAUTHENTICATED", "Authentication is required.");
    }
  }

  private normalizeProviderError(error: unknown): AIOrchestrationError {
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
