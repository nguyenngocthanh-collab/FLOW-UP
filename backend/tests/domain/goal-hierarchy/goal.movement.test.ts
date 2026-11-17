import { describe, expect, it } from "vitest";
import {
  validateGoalScopeMovement,
  type Goal, type GoalReader,
} from "../../../src/domain/goal-hierarchy";

const item: Goal = {
  id: "g-1", workspaceId: "w-1", projectId: null, parentGoalId: null,
  title: "Goal", description: null, targetDate: null,
  createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
};
const goals: GoalReader = {
  getGoal: (id) => id === item.id ? item : null,
  getGoals: () => [item],
};

describe("C03 scope movement validation contract", () => {
  const ownership = { validateGoalOwnership: () => ({ valid: true as const }) };
  const scopes = { validate: () => ({ valid: true as const }) };
  const noDependencies = { hasBlockingDependencies: () => false };

  it("accepts a valid preflight without mutating the Goal", () => {
    expect(validateGoalScopeMovement({
      callerUserId: "u-1", goalId: "g-1",
      destinationScope: { workspaceId: "w-1", projectId: null },
    }, goals, ownership, scopes, noDependencies)).toEqual({ valid: true });
    expect(goals.getGoal("g-1")).toEqual(item);
  });

  it("rejects a missing Goal", () => {
    expect(validateGoalScopeMovement({
      callerUserId: "u-1", goalId: "missing",
      destinationScope: { workspaceId: "w-1", projectId: null },
    }, goals, ownership, scopes, noDependencies))
      .toEqual({ valid: false, code: "GOAL_NOT_FOUND" });
  });

  it("rejects unresolved dependency conflicts", () => {
    expect(validateGoalScopeMovement({
      callerUserId: "u-1", goalId: "g-1",
      destinationScope: { workspaceId: "w-1", projectId: null },
    }, goals, ownership, scopes, { hasBlockingDependencies: () => true }))
      .toEqual({ valid: false, code: "GOAL_DEPENDENCY_CONFLICT" });
  });
});
