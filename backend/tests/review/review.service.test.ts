import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewService } from "../../src/modules/review/review.service";
import type { ReviewAccess, ReviewRepository, ReviewRules, ReviewSourceReader } from "../../src/modules/review/review.repository";
import type { ReviewUserContext } from "../../src/modules/review/review.types";
const user: ReviewUserContext = { userId: "u1", isAuthenticated: true };
describe("ReviewService", () => {
  let repo: ReviewRepository, access: ReviewAccess, sources: ReviewSourceReader, rules: ReviewRules, service: ReviewService;
  beforeEach(() => {
    repo = { create: vi.fn(async r => r), getById: vi.fn(async () => null), updateNote: vi.fn(async () => null), updateSummary: vi.fn(async () => null) };
    access = { assertScopeAccess: vi.fn(async () => undefined) };
    sources = {
      getPlannedWork: vi.fn(async () => ({ data: [] })), getActualExecution: vi.fn(async () => ({ data: [] })),
      getProgress: vi.fn(async () => ({ data: null, status: "UNAVAILABLE" as const, limitations: ["No history contract"] })),
      getMeasurement: vi.fn(async () => ({ data: null, status: "NOT_REQUESTED" as const })),
    };
    rules = {
      validation: { maxNoteLength: 500, requireGoalId: false, allowPeriodOnlyScope: true },
      matchPlannedToActual: vi.fn(() => ({ items: [], limitations: ["Matching contract pending"] })),
      generateSummary: vi.fn(input => ({ ...input, limitations: ["Policy fixture only"] })),
      now: () => "2026-11-17T00:00:00.000Z", createReviewRecord: false, persistSummary: false,
    };
    service = new ReviewService(repo, access, sources, rules);
  });
  it("preserves unavailable progress as unavailable", async () => {
    const result = await service.getReviewData(user, { goalId: "g1" });
    expect(result.progress.status).toBe("UNAVAILABLE");
    expect(result.progress.data).toBeNull();
  });
  it("blocks persistence until the model is approved", async () => {
    await expect(service.createReview(user, { scope: { goalId: "g1" } })).rejects.toMatchObject({ code: "REVIEW_INVALID_STATE" });
  });
});
