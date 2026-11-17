export type AIUserContext = { userId: string; isAuthenticated: true };

export type AIOperationType =
  | "GOAL_CLARIFICATION"
  | "GOAL_FEASIBILITY"
  | "GOAL_TREE_PROPOSAL"
  | "DAILY_PLAN_PROPOSAL";

export type AIRequestContext = {
  userId: string;
  operationType: AIOperationType;
  userInput: string;
  goalContext?: unknown;
  projectContext?: unknown;
  actionContext?: unknown;
  measurementContext?: unknown;
  planningContext?: unknown;
  progressContext?: unknown;
  constraints?: unknown;
};

export type AIProviderRequest = {
  operationType: AIOperationType;
  input: string;
  context: Omit<AIRequestContext, "userId" | "userInput" | "operationType">;
  outputSchemaKey: string;
};

export type AIProviderResponse = {
  content: unknown;
  finishReason?: string;
  truncated?: boolean;
  providerRequestId?: string;
};

export type AIProposalType = "GOAL_TREE" | "DAILY_PLAN";
export type AIProposalStatus =
  | "PENDING_REVIEW"
  | "EDITED"
  | "APPROVED"
  | "PARTIALLY_APPROVED"
  | "REJECTED"
  | "APPLIED"
  | "FAILED"
  | "EXPIRED";

export type AIProposal = {
  id: string;
  userId: string;
  operationType: AIOperationType;
  proposalType: AIProposalType;
  status: AIProposalStatus;
  proposalData: unknown;
  createdAt: string;
  updatedAt: string;
};

export type AIValidationIssue = {
  path: string;
  code: string;
  message: string;
};

export type AIOutputValidationResult<T = unknown> = {
  valid: boolean;
  value?: T;
  issues: AIValidationIssue[];
};

export type AIProposalSelection = {
  selectedItemIds: string[];
  editedData?: unknown;
};

export type AIApplicationOperationResult = {
  operation: string;
  success: boolean;
  entityId?: string;
  errorCode?: string;
};

export type AIProposalApplicationResult = {
  proposalId: string;
  status: "APPLIED" | "PARTIALLY_APPLIED" | "FAILED";
  operations: AIApplicationOperationResult[];
};
