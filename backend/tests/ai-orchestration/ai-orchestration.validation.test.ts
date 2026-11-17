import { describe, expect, it } from "vitest";
import { AIOrchestrationError } from "../../src/modules/ai-orchestration/ai-orchestration.errors";
import { validateAIRequest, validateProviderResponse } from "../../src/modules/ai-orchestration/ai-orchestration.validation";
const rules = { maxInputLength: 100, maxContextBytes: 1000, maxProposalItems: 10 };
describe("AI orchestration validation", () => {
  it("accepts a valid request", () => {
    expect(() => validateAIRequest({ userId: "u1", operationType: "GOAL_CLARIFICATION", userInput: "Clarify this goal" }, rules)).not.toThrow();
  });
  it("rejects unsupported operation", () => {
    expect(() => validateAIRequest({ userId: "u1", operationType: "UNKNOWN" as never, userInput: "x" }, rules)).toThrow(AIOrchestrationError);
  });
  it("rejects truncated provider response", () => {
    expect(() => validateProviderResponse({ content: { ok: true }, truncated: true })).toThrow(AIOrchestrationError);
  });
  it("rejects empty provider response", () => {
    expect(() => validateProviderResponse({ content: "" })).toThrow(AIOrchestrationError);
  });
});
