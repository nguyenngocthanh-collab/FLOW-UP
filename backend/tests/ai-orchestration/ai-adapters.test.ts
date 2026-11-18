import { describe, expect, it, vi } from "vitest";
import { createSqliteDatabase } from "../../src/infrastructure/database/sqlite.ts";
import { AIUsageLimiter, GoalDiscoveryOutputValidator, GoalProposalDomainApplier } from "../../src/modules/ai-orchestration/ai-adapters";
import { GeminiAIProvider } from "../../src/modules/ai-orchestration/gemini.provider";

describe("B10 goal discovery adapters", () => {
  it("accepts a bounded goal proposal and rejects invalid references", async () => {
    const validator = new GoalDiscoveryOutputValidator(10);
    const proposal = { summary: "A small plan", items: [
      { id: "root", type: "GOAL", title: "Learn Spanish", description: "", targetDate: null, parentItemId: null, rationale: "User outcome" },
      { id: "step", type: "MILESTONE", title: "Finish basics", description: "", targetDate: null, parentItemId: "root", rationale: "Checkpoint" },
    ] };
    expect(await validator.validate("GOAL_TREE_PROPOSAL", proposal)).toMatchObject({ valid: true, value: { provenance: "AI_PROPOSED" } });
    expect(await validator.validate("GOAL_TREE_PROPOSAL", { ...proposal, items: [{ ...proposal.items[1], parentItemId: "missing" }] })).toMatchObject({ valid: false });
  });

  it("keeps extracted information marked as needing user confirmation", async () => {
    const validator = new GoalDiscoveryOutputValidator(10);
    const result = await validator.validate("GOAL_CLARIFICATION", {
      outcome: "Run a half marathon", successCriteria: [], knownFacts: ["The user wants to run"],
      assumptions: [], missingInformation: ["Target date"], questions: [],
    });
    expect(result).toMatchObject({ valid: true, value: { provenance: "NEEDS_CONFIRMATION" } });
  });

  it("reports a clear unavailable state when the server key is missing", async () => {
    const provider = new GeminiAIProvider("");
    await expect(provider.generate({ operationType: "GOAL_CLARIFICATION", input: "A goal", context: {}, outputSchemaKey: "GOAL_CLARIFICATION" }))
      .rejects.toMatchObject({ code: "AI_PROVIDER_UNAVAILABLE" });
  });

  it("enforces per-user and global daily usage limits", () => {
    const db = createSqliteDatabase();
    try {
      const limiter = new AIUsageLimiter(db, 2, 3);
      expect(limiter.reserve("u1")).toBe(true);
      expect(limiter.reserve("u1")).toBe(true);
      expect(limiter.reserve("u1")).toBe(false);
      expect(limiter.reserve("u2")).toBe(true);
      expect(limiter.reserve("u3")).toBe(false);
    } finally { db.close(); }
  });

  it("does not turn a failed child Goal into a second root Goal", async () => {
    const createGoal = vi.fn(async () => ({ success: false as const, error: { code: "GOAL_PERSISTENCE_ERROR" as const, message: "failed" } }));
    const addChildGoal = vi.fn();
    const applier = new GoalProposalDomainApplier({
      goalService: { createGoal, addChildGoal } as never,
      milestoneService: {} as never,
      actionService: {} as never,
    });
    const proposal = {
      id: "p1", userId: "u1", operationType: "GOAL_TREE_PROPOSAL" as const,
      proposalType: "GOAL_TREE" as const, status: "PENDING_REVIEW" as const,
      proposalData: { summary: "plan", items: [
        { id: "root", type: "GOAL" as const, title: "Root", description: "", targetDate: null, parentItemId: null, rationale: "" },
        { id: "child", type: "GOAL" as const, title: "Child", description: "", targetDate: null, parentItemId: "root", rationale: "" },
      ] }, createdAt: "", updatedAt: "",
    };
    const result = await applier.applyApprovedProposal("u1", proposal, { selectedItemIds: ["root", "child"] });
    expect(result.status).toBe("FAILED");
    expect(createGoal).toHaveBeenCalledOnce();
    expect(addChildGoal).not.toHaveBeenCalled();
  });
});
