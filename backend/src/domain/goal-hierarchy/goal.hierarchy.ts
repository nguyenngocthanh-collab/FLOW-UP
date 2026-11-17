import type {
  C03ValidationResult,
  Goal,
  GoalId,
  GoalReader,
} from "./goal.types";

export type HierarchyError =
  | "GOAL_NOT_FOUND"
  | "GOAL_PARENT_NOT_FOUND"
  | "GOAL_SELF_PARENTING"
  | "GOAL_HIERARCHY_CYCLE"
  | "GOAL_HIERARCHY_INVALID"
  | "GOAL_SCOPE_POLICY_UNRESOLVED";

function sameWorkspace(parent: Goal, child: Goal): boolean {
  return parent.workspaceId === child.workspaceId;
}

/**
 * Enforces confirmed Workspace boundary. Different Project scopes within the
 * same Workspace remain blocked because GOAL-006 is OPEN.
 */
export function validateParentRelationship(
  childGoalId: GoalId,
  proposedParentGoalId: GoalId | null,
  reader: GoalReader,
): C03ValidationResult<HierarchyError> {
  const child = reader.getGoal(childGoalId);
  if (!child) return { valid: false, code: "GOAL_NOT_FOUND" };
  if (proposedParentGoalId === null) return { valid: true };
  if (proposedParentGoalId === childGoalId) {
    return { valid: false, code: "GOAL_SELF_PARENTING" };
  }

  const parent = reader.getGoal(proposedParentGoalId);
  if (!parent) return { valid: false, code: "GOAL_PARENT_NOT_FOUND" };
  if (!sameWorkspace(parent, child)) {
    return { valid: false, code: "GOAL_HIERARCHY_INVALID" };
  }
  if (parent.projectId !== child.projectId) {
    return { valid: false, code: "GOAL_SCOPE_POLICY_UNRESOLVED" };
  }

  const visited = new Set<GoalId>([childGoalId]);
  let cursor: Goal | null = parent;

  while (cursor) {
    if (visited.has(cursor.id)) {
      return { valid: false, code: "GOAL_HIERARCHY_CYCLE" };
    }
    visited.add(cursor.id);
    if (cursor.parentGoalId === null) break;
    cursor = reader.getGoal(cursor.parentGoalId);
    if (!cursor) return { valid: false, code: "GOAL_HIERARCHY_INVALID" };
  }

  return { valid: true };
}

export function getGoalAncestors(
  goalId: GoalId,
  reader: GoalReader,
): C03ValidationResult<"GOAL_NOT_FOUND" | "GOAL_HIERARCHY_INVALID" | "GOAL_HIERARCHY_CYCLE"> & {
  readonly goals?: readonly Goal[];
} {
  const start = reader.getGoal(goalId);
  if (!start) return { valid: false, code: "GOAL_NOT_FOUND" };

  const ancestors: Goal[] = [];
  const visited = new Set<GoalId>([goalId]);
  let parentId = start.parentGoalId;

  while (parentId !== null) {
    if (visited.has(parentId)) return { valid: false, code: "GOAL_HIERARCHY_CYCLE" };
    visited.add(parentId);
    const parent = reader.getGoal(parentId);
    if (!parent) return { valid: false, code: "GOAL_HIERARCHY_INVALID" };
    ancestors.push(parent);
    parentId = parent.parentGoalId;
  }

  return { valid: true, goals: ancestors };
}

export function getGoalDescendants(
  goalId: GoalId,
  reader: GoalReader,
): C03ValidationResult<"GOAL_NOT_FOUND" | "GOAL_HIERARCHY_INVALID" | "GOAL_HIERARCHY_CYCLE"> & {
  readonly goals?: readonly Goal[];
} {
  const root = reader.getGoal(goalId);
  if (!root) return { valid: false, code: "GOAL_NOT_FOUND" };

  const all = reader.getGoals();
  const childrenByParent = new Map<GoalId, Goal[]>();
  for (const goal of all) {
    if (goal.parentGoalId === null) continue;
    const list = childrenByParent.get(goal.parentGoalId) ?? [];
    list.push(goal);
    childrenByParent.set(goal.parentGoalId, list);
  }

  const descendants: Goal[] = [];
  const visited = new Set<GoalId>([goalId]);
  const stack = [...(childrenByParent.get(goalId) ?? [])].reverse();

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current.id)) return { valid: false, code: "GOAL_HIERARCHY_CYCLE" };
    visited.add(current.id);
    descendants.push(current);
    const children = childrenByParent.get(current.id) ?? [];
    for (let i = children.length - 1; i >= 0; i -= 1) stack.push(children[i]);
  }

  // A dangling parent reference is invalid when encountered in the traversed tree.
  for (const goal of descendants) {
    if (goal.parentGoalId && !reader.getGoal(goal.parentGoalId)) {
      return { valid: false, code: "GOAL_HIERARCHY_INVALID" };
    }
  }
  return { valid: true, goals: descendants };
}

export interface GoalTreeNode {
  readonly goal: Goal;
  readonly children: readonly GoalTreeNode[];
}

export function buildGoalTree(
  rootGoalId: GoalId,
  reader: GoalReader,
): C03ValidationResult<"GOAL_NOT_FOUND" | "GOAL_HIERARCHY_INVALID" | "GOAL_HIERARCHY_CYCLE"> & {
  readonly tree?: GoalTreeNode;
} {
  const root = reader.getGoal(rootGoalId);
  if (!root) return { valid: false, code: "GOAL_NOT_FOUND" };

  const all = reader.getGoals();
  const childrenByParent = new Map<GoalId, Goal[]>();
  for (const goal of all) {
    if (goal.parentGoalId === null) continue;
    const children = childrenByParent.get(goal.parentGoalId) ?? [];
    children.push(goal);
    childrenByParent.set(goal.parentGoalId, children);
  }

  const visiting = new Set<GoalId>();
  const build = (goal: Goal): GoalTreeNode | null => {
    if (visiting.has(goal.id)) return null;
    visiting.add(goal.id);
    const children: GoalTreeNode[] = [];
    for (const child of childrenByParent.get(goal.id) ?? []) {
      const node = build(child);
      if (!node) return null;
      children.push(node);
    }
    visiting.delete(goal.id);
    return { goal, children };
  };

  const tree = build(root);
  if (!tree) return { valid: false, code: "GOAL_HIERARCHY_CYCLE" };
  return { valid: true, tree };
}
