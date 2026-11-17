import { describe, expect, it } from "vitest";
import {
  validateCreateMilestoneInput,
  validateUpdateMilestoneInput
} from "../../src/modules/milestone/milestone.validation";

describe("B04 Milestone validation", () => {
  it("accepts a valid Milestone", () => {
    expect(validateCreateMilestoneInput({
      goalId: "goal-1",
      title: "Reach Reading Band 6.0"
    }).valid).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(validateCreateMilestoneInput({
      goalId: "goal-1",
      title: " "
    })).toMatchObject({
      valid: false,
      code: "MILESTONE_INVALID_TITLE"
    });
  });

  it("rejects a missing Goal ID", () => {
    expect(validateCreateMilestoneInput({
      goalId: "",
      title: "Complete reading practice"
    })).toMatchObject({
      valid: false,
      code: "MILESTONE_INVALID_INPUT"
    });
  });

  it("rejects an invalid target date", () => {
    expect(validateCreateMilestoneInput({
      goalId: "goal-1",
      title: "Reach band 6",
      targetDate: "not-a-date"
    })).toMatchObject({
      valid: false,
      code: "MILESTONE_INVALID_INPUT"
    });
  });

  it("rejects an empty update", () => {
    expect(validateUpdateMilestoneInput({})).toMatchObject({
      valid: false,
      code: "MILESTONE_INVALID_INPUT"
    });
  });
});
