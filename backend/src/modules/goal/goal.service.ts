import { createGoalError } from "./goal.errors";
import type { GoalRepository, GoalWorkspaceAccess } from "./goal.repository";
import type {
  AuthenticatedUserContext,
  CreateGoalInput,
  Goal,
  GoalHierarchyNode,
  GoalResult,
  GoalScope,
  GoalService,
  ListGoalsFilter,
  UpdateGoalInput
} from "./goal.types";
import {
  validateCreateGoalInput,
  validateUpdateGoalInput
} from "./goal.validation";

function success<T>(data: T): GoalResult<T> {
  return { success: true, data };
}

function failure<T>(
  code: Parameters<typeof createGoalError>[0]
): GoalResult<T> {
  return { success: false, error: createGoalError(code) };
}

function isTrustedUser(
  user: AuthenticatedUserContext | null | undefined
): user is AuthenticatedUserContext {
  return Boolean(
    user &&
    user.isAuthenticated === true &&
    typeof user.userId === "string" &&
    user.userId.trim().length > 0
  );
}

function normalizeError<T>(error: unknown): GoalResult<T> {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message).toLowerCase()
      : "";
  if (message.includes("not found")) return failure("GOAL_NOT_FOUND");
  return failure("GOAL_PERSISTENCE_ERROR");
}

function buildHierarchy(goals: Goal[]): GoalResult<GoalHierarchyNode[]> {
  const byId = new Map<string, GoalHierarchyNode>();
  for (const goal of goals) {
    if (byId.has(goal.id)) return failure("GOAL_INVALID_HIERARCHY");
    byId.set(goal.id, { goal, children: [] });
  }

  const roots: GoalHierarchyNode[] = [];
  for (const goal of goals) {
    const node = byId.get(goal.id)!;
    if (goal.parentGoalId === null) {
      roots.push(node);
      continue;
    }

    const parent = byId.get(goal.parentGoalId);
    if (!parent) return failure("GOAL_INVALID_HIERARCHY");
    parent.children.push(node);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(node: GoalHierarchyNode): boolean {
    if (visiting.has(node.goal.id)) return false;
    if (visited.has(node.goal.id)) return true;
    visiting.add(node.goal.id);
    for (const child of node.children) {
      if (!visit(child)) return false;
    }
    visiting.delete(node.goal.id);
    visited.add(node.goal.id);
    return true;
  }

  for (const root of roots) {
    if (!visit(root)) return failure("GOAL_INVALID_HIERARCHY");
  }
  if (visited.size !== goals.length) {
    return failure("GOAL_INVALID_HIERARCHY");
  }

  return success(roots);
}

export function createGoalService(
  repository: GoalRepository,
  workspaceAccess: GoalWorkspaceAccess
): GoalService {
  async function resolveWorkspace(user: AuthenticatedUserContext) {
    if (!isTrustedUser(user)) return failure<string>("GOAL_UNAUTHENTICATED");
    try {
      const workspaceId = await workspaceAccess.getCurrentWorkspaceId(user.userId);
      return workspaceId
        ? success(workspaceId)
        : failure<string>("GOAL_ACCESS_DENIED");
    } catch {
      return failure<string>("GOAL_PERSISTENCE_ERROR");
    }
  }

  async function resolveOwnedGoal(
    user: AuthenticatedUserContext,
    goalId: string
  ): Promise<GoalResult<{ goal: Goal; workspaceId: string }>> {
    if (!isTrustedUser(user)) {
      return failure("GOAL_UNAUTHENTICATED");
    }
    if (!goalId?.trim()) return failure("GOAL_NOT_FOUND");

    try {
      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      const goal = await repository.findGoalById(goalId);
      if (!goal) return failure("GOAL_NOT_FOUND");
      if (goal.workspaceId !== workspaceResult.data) {
        return failure("GOAL_ACCESS_DENIED");
      }
      return success({ goal, workspaceId: workspaceResult.data });
    } catch (error) {
      return normalizeError(error);
    }
  }

  async function validateParent(
    workspaceId: string,
    parentGoalId: string,
    childProjectId: string | null
  ): Promise<GoalResult<Goal>> {
    try {
      const parent = await repository.findGoalById(parentGoalId);
      if (!parent) return failure("GOAL_PARENT_NOT_FOUND");
      if (parent.workspaceId !== workspaceId) {
        return failure("GOAL_OWNERSHIP_MISMATCH");
      }
      if (parent.archivedAt !== null) return failure("GOAL_PARENT_INVALID");
      if (parent.projectId !== childProjectId) {
        return failure("GOAL_INVALID_PLACEMENT");
      }
      return success(parent);
    } catch (error) {
      return normalizeError(error);
    }
  }

  async function wouldCreateCycle(
    parentGoalId: string,
    childGoalId: string
  ): Promise<boolean> {
    if (parentGoalId === childGoalId) return true;
    const descendants = await repository.findDescendantIds(childGoalId);
    return descendants.includes(parentGoalId);
  }

  return {
    async createGoal(user, input: CreateGoalInput) {
      if (!isTrustedUser(user)) return failure("GOAL_UNAUTHENTICATED");
      const validation = validateCreateGoalInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "GOAL_INVALID_INPUT");
      }

      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;
      const workspaceId = workspaceResult.data;

      try {
        const projectId = input.projectId ?? null;
        if (projectId) {
          const allowed = await workspaceAccess.validateProjectInWorkspace(
            user.userId, workspaceId, projectId
          );
          if (!allowed) return failure("GOAL_INVALID_PLACEMENT");
        }

        const parentGoalId = input.parentGoalId ?? null;
        if (parentGoalId) {
          const parentResult = await validateParent(
            workspaceId, parentGoalId, projectId
          );
          if (!parentResult.success) return parentResult;
        }

        const goal = await repository.createGoal(workspaceId, {
          title: input.title.trim(),
          description:
            input.description === undefined || input.description === null
              ? null
              : input.description.trim() || null,
          targetDate: input.targetDate ?? null,
          projectId,
          parentGoalId
        });

        if (
          goal.workspaceId !== workspaceId ||
          goal.projectId !== projectId ||
          goal.parentGoalId !== parentGoalId
        ) {
          return failure("GOAL_PERSISTENCE_ERROR");
        }
        return success(goal);
      } catch (error) {
        return normalizeError(error);
      }
    },

    async getGoal(user, goalId) {
      const result = await resolveOwnedGoal(user, goalId);
      return result.success ? success(result.data.goal) : result;
    },

    async listGoals(user, filter: ListGoalsFilter = {}) {
      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      try {
        if (filter.projectId) {
          const allowed = await workspaceAccess.validateProjectInWorkspace(
            user.userId, workspaceResult.data, filter.projectId
          );
          if (!allowed) return failure("GOAL_INVALID_PLACEMENT");
        }

        const goals = await repository.listGoalsByWorkspaceId(
          workspaceResult.data,
          filter
        );
        return success(goals);
      } catch (error) {
        return normalizeError(error);
      }
    },

    async updateGoal(user, goalId, input: UpdateGoalInput) {
      const owned = await resolveOwnedGoal(user, goalId);
      if (!owned.success) return owned;

      const validation = validateUpdateGoalInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "GOAL_INVALID_INPUT");
      }

      const safeInput: UpdateGoalInput = {};
      if (input.title !== undefined) safeInput.title = input.title.trim();
      if (input.description !== undefined) {
        safeInput.description =
          input.description === null ? null : input.description.trim() || null;
      }
      if (input.targetDate !== undefined) safeInput.targetDate = input.targetDate;

      try {
        const updated = await repository.updateGoal(goalId, safeInput);
        if (
          updated.id !== owned.data.goal.id ||
          updated.workspaceId !== owned.data.goal.workspaceId ||
          updated.projectId !== owned.data.goal.projectId ||
          updated.parentGoalId !== owned.data.goal.parentGoalId
        ) {
          return failure("GOAL_INVALID_HIERARCHY");
        }
        return success(updated);
      } catch (error) {
        return normalizeError(error);
      }
    },

    async addChildGoal(user, parentGoalId, input) {
      const parentResult = await resolveOwnedGoal(user, parentGoalId);
      if (!parentResult.success) return parentResult;
      return this.createGoal(user, {
        ...input,
        projectId: parentResult.data.goal.projectId,
        parentGoalId
      });
    },

    async getGoalHierarchy(user, scope: GoalScope = {}) {
      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      try {
        if (scope.projectId) {
          const allowed = await workspaceAccess.validateProjectInWorkspace(
            user.userId, workspaceResult.data, scope.projectId
          );
          if (!allowed) return failure("GOAL_INVALID_PLACEMENT");
        }

        if (scope.rootGoalId) {
          const rootResult = await resolveOwnedGoal(user, scope.rootGoalId);
          if (!rootResult.success) return rootResult;
        }

        const goals = await repository.listGoalsByWorkspaceId(
          workspaceResult.data,
          {
            projectId: scope.projectId,
            includeArchived: scope.includeArchived
          }
        );

        const scopedGoals = scope.rootGoalId
          ? goals.filter((goal) => goal.id === scope.rootGoalId ||
              goal.parentGoalId === scope.rootGoalId ||
              goals.some((candidate) =>
                candidate.id === goal.parentGoalId &&
                candidate.parentGoalId === scope.rootGoalId
              ))
          : goals;

        return buildHierarchy(scopedGoals);
      } catch (error) {
        return normalizeError(error);
      }
    },

    async validateParentChild(user, parentGoalId, childGoalId) {
      const parentResult = await resolveOwnedGoal(user, parentGoalId);
      if (!parentResult.success) return parentResult;
      const childResult = await resolveOwnedGoal(user, childGoalId);
      if (!childResult.success) return childResult;

      const parent = parentResult.data.goal;
      const child = childResult.data.goal;

      if (parent.id === child.id) return failure("GOAL_CIRCULAR_REFERENCE");
      if (parent.workspaceId !== child.workspaceId) {
        return failure("GOAL_OWNERSHIP_MISMATCH");
      }
      if (parent.projectId !== child.projectId) {
        return failure("GOAL_INVALID_PLACEMENT");
      }

      try {
        if (await wouldCreateCycle(parent.id, child.id)) {
          return failure("GOAL_CIRCULAR_REFERENCE");
        }
        return success(true);
      } catch (error) {
        return normalizeError(error);
      }
    }
  };
}
