import { describe, expect, it } from "vitest";
import {
  validateCreateGoalInput,
  validateUpdateGoalInput
} from "../../src/modules/goal/goal.validation";

describe("B03 Goal validation", () => {
  it("accepts a valid Goal", () => {
    expect(validateCreateGoalInput({ title: "Complete FLOW-UP MVP" }).valid)
      .toBe(true);
  });

  it("rejects an empty title", () => {
    expect(validateCreateGoalInput({ title: " " })).toMatchObject({
      valid: false,
      code: "GOAL_INVALID_TITLE"
    });
  });

  it("rejects an invalid target date", () => {
    expect(validateCreateGoalInput({
      title: "Goal",
      targetDate: "not-a-date"
    })).toMatchObject({
      valid: false,
      code: "GOAL_INVALID_INPUT"
    });
  });

  it("rejects an empty update", () => {
    expect(validateUpdateGoalInput({})).toMatchObject({
      valid: false,
      code: "GOAL_INVALID_INPUT"
    });
  });
});
