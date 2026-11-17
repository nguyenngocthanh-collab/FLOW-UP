import { AIOrchestrationError } from "./ai-orchestration.errors";
import type { AIRequestContext, AIOperationType, AIProviderResponse } from "./ai-orchestration.types";

const OPERATIONS: AIOperationType[] = [
  "GOAL_CLARIFICATION", "GOAL_FEASIBILITY", "GOAL_TREE_PROPOSAL", "DAILY_PLAN_PROPOSAL",
];

export type AIValidationRules = {
  maxInputLength: number;
  maxContextBytes: number;
  maxProposalItems: number;
};

export function validateAIRequest(
  input: AIRequestContext,
  rules: AIValidationRules,
): void {
  if (!input || typeof input !== "object" || !input.userId || !input.userInput?.trim()) {
    throw new AIOrchestrationError("AI_INVALID_REQUEST", "A valid authenticated request and user input are required.");
  }
  if (!OPERATIONS.includes(input.operationType)) {
    throw new AIOrchestrationError("AI_INVALID_OPERATION", "Unsupported AI operation.");
  }
  if (input.userInput.trim().length > rules.maxInputLength) {
    throw new AIOrchestrationError("AI_INVALID_REQUEST", "AI input exceeds the configured limit.");
  }
  let bytes: number;
  try {
    bytes = new TextEncoder().encode(JSON.stringify({
      goalContext: input.goalContext, projectContext: input.projectContext,
      actionContext: input.actionContext, measurementContext: input.measurementContext,
      planningContext: input.planningContext, progressContext: input.progressContext,
      constraints: input.constraints,
    })).length;
  } catch {
    throw new AIOrchestrationError("AI_INVALID_REQUEST", "AI context must be serializable.");
  }
  if (bytes > rules.maxContextBytes) {
    throw new AIOrchestrationError("AI_INVALID_REQUEST", "AI context exceeds the configured limit.");
  }
}

export function validateProviderResponse(response: AIProviderResponse): void {
  if (!response || response.content === null || response.content === undefined || response.content === "") {
    throw new AIOrchestrationError("AI_EMPTY_RESPONSE", "The AI provider returned no usable content.");
  }
  if (response.truncated || response.finishReason === "length") {
    throw new AIOrchestrationError("AI_OUTPUT_TRUNCATED", "The AI provider response was truncated.");
  }
}

export function validateProposalItemCount(
  items: unknown[],
  rules: AIValidationRules,
): void {
  if (items.length > rules.maxProposalItems) {
    throw new AIOrchestrationError("AI_OUTPUT_INVALID", "Proposal contains too many items.");
  }
}
