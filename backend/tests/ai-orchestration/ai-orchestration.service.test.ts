import { beforeEach, describe, expect, it, vi } from "vitest";
import { AIOrchestrationService } from "../../src/modules/ai-orchestration/ai-orchestration.service";
import type { AIContextReader, AIOrchestrationRules, AIOutputValidator, AIProposalDomainApplier, AIProposalRepository, AIProvider } from "../../src/modules/ai-orchestration/ai-orchestration.repository";
import type { AIUserContext } from "../../src/modules/ai-orchestration/ai-orchestration.types";
const user: AIUserContext = { userId: "u1", isAuthenticated: true };
describe("AIOrchestrationService", () => {
  let context: AIContextReader, provider: AIProvider, validator: AIOutputValidator, repo: AIProposalRepository, applier: AIProposalDomainApplier, rules: AIOrchestrationRules, service: AIOrchestrationService;
  beforeEach(() => {
    context = { buildContext: vi.fn(async (userId, operationType, userInput) => ({ userId, operationType, userInput })) };
    provider = { generate: vi.fn(async () => ({ content: { questions: ["What outcome do you want?"] } })) };
    validator = { validate: vi.fn(async (_operation, output) => ({ valid: true, value: output, issues: [] })) };
    repo = { create: vi.fn(async p => p), getById: vi.fn(async () => null), update: vi.fn(async p => p) };
    applier = { validateProposal: vi.fn(async () => undefined), applyApprovedProposal: vi.fn(async () => ({ proposalId: "p1", status: "APPLIED" as const, operations: [] })) };
    rules = { validation: { maxInputLength: 1000, maxContextBytes: 10000, maxProposalItems: 20 }, now: () => "2026-11-17T00:00:00.000Z", createProposalId: () => "p1", proposalPersistenceEnabled: false };
    service = new AIOrchestrationService(context, provider, validator, repo, applier, rules);
  });
  it("executes a clarification request and returns validated output", async () => {
    const result = await service.execute(user, "GOAL_CLARIFICATION", "Help clarify my goal");
    expect(result).toEqual({ questions: ["What outcome do you want?"] });
    expect(provider.generate).toHaveBeenCalledOnce();
  });
  it("does not persist proposal while proposal model is unapproved", async () => {
    await expect(service.execute(user, "GOAL_TREE_PROPOSAL", "Break down this goal")).rejects.toMatchObject({ code: "AI_PERSISTENCE_ERROR" });
  });
});
