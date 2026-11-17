import { describe, expect, it } from "vitest";
import { validateReorder } from "../../../src/domain/C04";
import type { Milestone } from "../../../src/domain/C04";

const item = (id: string, goalId: string): Milestone => ({
  id: id as never, goalId: goalId as never, title: id, description: null, targetDate: null,
  status: "UNSPECIFIED", position: 0, completedAt: null, createdAt: "now", updatedAt: "now",
});
describe("C04 reorder invariants", () => {
  it("accepts a permutation of all milestones in the same Goal", () =>
    expect(validateReorder([item("m1","g1"), item("m2","g1")], "g1", ["m2","m1"])).toBeNull());
  it("rejects missing, duplicate, or foreign milestone IDs", () =>
    expect(validateReorder([item("m1","g1"), item("m2","g1")], "g1", ["m1","m1"]).code).toBe("MILESTONE_REORDER_INVALID"));
  it("does not include milestones from another Goal in the reorder set", () =>
    expect(validateReorder([item("m1","g1"), item("m2","g2")], "g1", ["m1"])).toBeNull());
});
