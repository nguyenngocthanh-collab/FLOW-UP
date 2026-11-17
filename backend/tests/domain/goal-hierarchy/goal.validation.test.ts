import { describe, expect, it } from "vitest";
import { validateGoalAttributes, validateGoalScope } from "../../../src/domain/goal-hierarchy";

describe("C03 Goal validation", () => {
  it("accepts valid required attributes and optional values", () => {
    expect(validateGoalAttributes({
      id: "g-1", title: "Learn TypeScript", description: null, targetDate: "2027-01-31",
    })).toEqual({ valid: true });
  });

  it("rejects empty title", () => {
    expect(validateGoalAttributes({ id: "g-1", title: "  " }))
      .toEqual({ valid: false, code: "GOAL_INVALID_TITLE" });
  });

  it("rejects impossible calendar dates", () => {
    expect(validateGoalAttributes({ id: "g-1", title: "Valid", targetDate: "2027-02-30" }))
      .toEqual({ valid: false, code: "GOAL_INVALID_TARGET_DATE" });
  });

  it("delegates Workspace/Project rules to C02", () => {
    const scopeValidator = { validate: () => ({ valid: true as const }) };
    expect(validateGoalScope("u-1", { workspaceId: "w-1", projectId: null }, scopeValidator))
      .toEqual({ valid: true });
  });

  it("does not invent an independent Goal without a Workspace", () => {
    const scopeValidator = { validate: () => ({ valid: true as const }) };
    expect(validateGoalScope("u-1", { workspaceId: "", projectId: null }, scopeValidator))
      .toEqual({ valid: false, code: "GOAL_SCOPE_INVALID" });
  });
});
