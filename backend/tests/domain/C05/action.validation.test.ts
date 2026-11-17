import { describe, expect, it } from "vitest";
import { validateActionTitle, validateActionAssociations, validateExecutionData } from "../../../src/domain/C05";
import type { ExecutionData } from "../../../src/domain/C05";

const execution = (overrides: Partial<ExecutionData> = {}): ExecutionData => ({
  actionId: "a1" as never, actualStartedAt: null, actualCompletedAt: null,
  actualDurationMinutes: null, executionNote: null, ...overrides,
});
describe("C05 Action validation", () => {
  it("rejects blank Action titles", () => expect(validateActionTitle(" ")?.code).toBe("ACTION_INVALID_TITLE"));
  it("accepts a nonblank Action title", () => expect(validateActionTitle("Read chapter")).toBeNull());
  it("rejects inaccessible associations", () => expect(validateActionAssociations({
    directGoalId: "g1", milestoneGoalId: null, goalAccessible: false, goalValid: true,
    milestoneAccessible: true, milestoneValid: true,
  })?.code).toBe("ACTION_ACCESS_DENIED"));
  it("rejects conflicting direct and Milestone-derived Goals", () => expect(validateActionAssociations({
    directGoalId: "g1", milestoneGoalId: "g2", goalAccessible: true, goalValid: true,
    milestoneAccessible: true, milestoneValid: true,
  })?.code).toBe("ACTION_ASSOCIATION_CONFLICT"));
  it("allows missing direct Goal pending cardinality decision", () => expect(validateActionAssociations({
    directGoalId: null, milestoneGoalId: "g1", goalAccessible: true, goalValid: true,
    milestoneAccessible: true, milestoneValid: true,
  })).toBeNull());
  it("rejects completion before start", () => expect(validateExecutionData(execution({
    actualStartedAt: "2026-11-17T10:00:00Z", actualCompletedAt: "2026-11-17T09:00:00Z",
  }))?.code).toBe("ACTION_EXECUTION_TIME_CONFLICT"));
  it("rejects negative duration without defining duration semantics", () => expect(validateExecutionData(
    execution({ actualDurationMinutes: -1 })
  )?.code).toBe("ACTION_EXECUTION_DURATION_INVALID"));
  it("accepts absent execution facts", () => expect(validateExecutionData(execution())).toBeNull());
});
