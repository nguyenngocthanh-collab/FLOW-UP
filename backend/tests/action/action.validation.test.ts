import { describe, expect, it } from "vitest";
import {
  validateCreateActionInput,
  validateExecutionInput,
  validateUpdateActionInput
} from "../../src/modules/action/action.validation";

describe("B05 Action validation", () => {
  it("accepts a valid Action", () => {
    expect(validateCreateActionInput({
      goalId: "goal-1",
      title: "Complete reading test"
    }).valid).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(validateCreateActionInput({
      goalId: "goal-1",
      title: " "
    })).toMatchObject({ valid: false, code: "ACTION_INVALID_TITLE" });
  });

  it("rejects a missing Goal ID", () => {
    expect(validateCreateActionInput({
      goalId: "",
      title: "Read chapter"
    })).toMatchObject({ valid: false, code: "ACTION_INVALID_INPUT" });
  });

  it("rejects negative execution duration", () => {
    expect(validateExecutionInput({
      actualDurationMinutes: -1
    })).toMatchObject({ valid: false, code: "ACTION_INVALID_EXECUTION_DATA" });
  });

  it("rejects completion before start", () => {
    expect(validateExecutionInput({
      actualStartedAt: "2026-11-17T12:00:00.000Z",
      actualCompletedAt: "2026-11-17T11:00:00.000Z"
    })).toMatchObject({ valid: false, code: "ACTION_INVALID_TIME_RANGE" });
  });

  it("rejects an empty update", () => {
    expect(validateUpdateActionInput({})).toMatchObject({
      valid: false,
      code: "ACTION_INVALID_INPUT"
    });
  });
});
