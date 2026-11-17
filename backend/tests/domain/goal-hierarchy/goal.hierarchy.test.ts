import { describe, expect, it } from "vitest";
import {
  buildGoalTree, getGoalAncestors, getGoalDescendants, validateParentRelationship,
  type Goal, type GoalReader,
} from "../../../src/domain/goal-hierarchy";

const goal = (id: string, parentGoalId: string | null): Goal => ({
  id, workspaceId: "w-1", projectId: null, parentGoalId,
  title: id, description: null, targetDate: null, createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
});

function reader(items: Goal[]): GoalReader {
  return {
    getGoal: (id) => items.find((item) => item.id === id) ?? null,
    getGoals: () => items,
  };
}

describe("C03 Goal hierarchy", () => {
  const items = [goal("root", null), goal("child", "root"), goal("leaf", "child")];

  it("validates a parent relationship", () => {
    expect(validateParentRelationship("leaf", "root", reader(items))).toEqual({ valid: true });
  });

  it("rejects self-parenting", () => {
    expect(validateParentRelationship("root", "root", reader(items)))
      .toEqual({ valid: false, code: "GOAL_SELF_PARENTING" });
  });

  it("rejects a cycle", () => {
    expect(validateParentRelationship("root", "leaf", reader(items)))
      .toEqual({ valid: false, code: "GOAL_HIERARCHY_CYCLE" });
  });

  it("returns ancestors from immediate parent to root", () => {
    expect(getGoalAncestors("leaf", reader(items))).toEqual({
      valid: true, goals: [items[1], items[0]],
    });
  });

  it("returns descendants without duplicates", () => {
    expect(getGoalDescendants("root", reader(items))).toEqual({
      valid: true, goals: [items[1], items[2]],
    });
  });

  it("builds a nested Goal tree", () => {
    const result = buildGoalTree("root", reader(items));
    expect(result.valid).toBe(true);
    expect(result.tree?.children[0].children[0].goal.id).toBe("leaf");
  });

  it("rejects parent-child scope mismatch while policy is OPEN", () => {
    const differentProject = { ...goal("p-child", "root"), projectId: "p-2" };
    expect(validateParentRelationship("p-child", "root", reader([items[0], differentProject])))
      .toEqual({ valid: false, code: "GOAL_SCOPE_POLICY_UNRESOLVED" });
  });
});
