import type {
  AIProposal, AIProposalSelection, AIProposalApplicationResult, AIRequestContext,
  AIProviderRequest, AIProviderResponse, AIOutputValidationResult, AIOperationType,
  AIProposalStatus,
} from "./ai-orchestration.types";

export interface AIContextReader {
  buildContext(userId: string, operation: AIOperationType, input: string, references?: unknown): Promise<AIRequestContext>;
}

export interface AIProvider {
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
}

export interface AIOutputValidator {
  validate(operation: AIOperationType, output: unknown): Promise<AIOutputValidationResult>;
}

export interface AIProposalRepository {
  create(proposal: AIProposal): Promise<AIProposal>;
  getById(proposalId: string): Promise<AIProposal | null>;
  update(proposal: AIProposal, expectedStatus?: AIProposalStatus): Promise<AIProposal>;
  claimForApplication(proposalId: string, userId: string, updatedAt: string): Promise<boolean>;
}

export interface AIUsageReservation {
  reserve(userId: string): boolean;
}

export interface AIProposalDomainApplier {
  validateProposal(userId: string, proposal: AIProposal, selection: AIProposalSelection): Promise<void>;
  applyApprovedProposal(userId: string, proposal: AIProposal, selection: AIProposalSelection): Promise<AIProposalApplicationResult>;
}

export interface AIOrchestrationRules {
  validation: { maxInputLength: number; maxContextBytes: number; maxProposalItems: number };
  now(): string;
  createProposalId(): string;
  proposalPersistenceEnabled: boolean;
}
