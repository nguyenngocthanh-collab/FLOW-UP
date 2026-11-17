import { describe, expect, it } from "vitest";
import { validateMilestoneTitle, validateTargetDate, validateGoalReference, validateMilestonePosition } from "../../../src/domain/C04";

describe("C04 Milestone validation", () => {
  it("rejects blank titles", () => expect(validateMilestoneTitle("  ")?.code).toBe("MILESTONE_INVALID_TITLE"));
  it("accepts a nonblank title", () => expect(validateMilestoneTitle("Checkpoint")).toBeNull());
  it("accepts an optional absent target date", () => expect(validateTargetDate(null)).toBeNull());
  it("rejects impossible calendar dates", () => expect(validateTargetDate("2026-02-30")?.code).toBe("MILESTONE_INVALID_TARGET_DATE"));
  it("accepts a valid calendar date", () => expect(validateTargetDate("2026-11-17")).toBeNull());
  it("validates the referenced Goal", () => {
    expect(validateGoalReference(null)?.code).toBe("MILESTONE_GOAL_NOT_FOUND");
    expect(validateGoalReference({ id: "g" as never, accessible: true, valid: true })).toBeNull();
  });
  it("rejects negative positions", () => expect(validateMilestonePosition(-1)?.code).toBe("MILESTONE_REORDER_INVALID"));
});
