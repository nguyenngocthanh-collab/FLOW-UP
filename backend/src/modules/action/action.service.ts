import { createActionError } from "./action.errors";
import type {
  Action,
  ActionErrorCode,
  ActionResult,
  ActionStatus,
  CreateActionInput,
  RecordExecutionInput,
  UpdateActionInput,
  ActionExecutionData
} from "./action.types";
import type {
  ActionGoalAccess,
  ActionMilestoneAccess,
  ActionRepository
} from "./action.repository";
import {
  validateCreateActionInput,
  validateExecutionInput,
  validateUpdateActionInput
} from "./action.validation";

export interface ActionUser {
  userId: string;
  email: string | null;
  isAuthenticated: true;
}

function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}
function fail<T>(code: ActionErrorCode): ActionResult<T> {
  return { success: false, error: createActionError(code) };
}
function authenticated(user: ActionUser | null | undefined): user is ActionUser {
  return Boolean(user?.isAuthenticated && user.userId?.trim());
}

export interface ActionService {
  createAction(user: ActionUser, input: CreateActionInput): Promise<ActionResult<Action>>;
  getAction(user: ActionUser, actionId: string): Promise<ActionResult<Action>>;
  listActionsByGoal(user: ActionUser, goalId: string): Promise<ActionResult<Action[]>>;
  listActionsByMilestone(user: ActionUser, milestoneId: string): Promise<ActionResult<Action[]>>;
  updateAction(user: ActionUser, actionId: string, input: UpdateActionInput): Promise<ActionResult<Action>>;
  updateActionStatus(user: ActionUser, actionId: string, status: ActionStatus): Promise<ActionResult<Action>>;
  completeAction(user: ActionUser, actionId: string, input?: { executionNote?: string }): Promise<ActionResult<Action>>;
  recordExecution(user: ActionUser, actionId: string, input: RecordExecutionInput): Promise<ActionResult<ActionExecutionData>>;
  getExecutionData(user: ActionUser, actionId: string): Promise<ActionResult<ActionExecutionData | null>>;
}

export function createActionService(
  repository: ActionRepository,
  goalAccess: ActionGoalAccess,
  milestoneAccess: ActionMilestoneAccess,
  now: () => string = () => new Date().toISOString()
): ActionService {
  async function checkGoal(user: ActionUser, goalId: string): Promise<ActionResult<true>> {
    try {
      const result = await goalAccess.validateGoal(user, goalId);
      if (result.success) return ok(true);
      return fail(result.error.code.includes("NOT_FOUND")
        ? "ACTION_GOAL_NOT_FOUND" : "ACTION_GOAL_ACCESS_DENIED");
    } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
  }

  async function checkMilestone(
    user: ActionUser, milestoneId: string, goalId: string
  ): Promise<ActionResult<true>> {
    try {
      const result = await milestoneAccess.validateMilestone(user, milestoneId, goalId);
      if (result.success) {
        if (result.data.goalId !== goalId) return fail("ACTION_INVALID_ASSOCIATION");
        return ok(true);
      }
      return fail(result.error.code.includes("NOT_FOUND")
        ? "ACTION_MILESTONE_NOT_FOUND" : "ACTION_MILESTONE_ACCESS_DENIED");
    } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
  }

  async function resolve(user: ActionUser, actionId: string): Promise<ActionResult<Action>> {
    if (!authenticated(user)) return fail("ACTION_UNAUTHENTICATED");
    if (!actionId?.trim()) return fail("ACTION_NOT_FOUND");
    try {
      const action = await repository.findById(actionId);
      if (!action) return fail("ACTION_NOT_FOUND");
      const goal = await checkGoal(user, action.goalId);
      if (!goal.success) return goal;
      if (action.milestoneId) {
        const milestone = await checkMilestone(user, action.milestoneId, action.goalId);
        if (!milestone.success) return milestone;
      }
      return ok(action);
    } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
  }

  return {
    async createAction(user, input) {
      if (!authenticated(user)) return fail("ACTION_UNAUTHENTICATED");
      const validation = validateCreateActionInput(input);
      if (!validation.valid) return fail(validation.code);
      const goal = await checkGoal(user, input.goalId);
      if (!goal.success) return goal;
      if (input.milestoneId) {
        const milestone = await checkMilestone(user, input.milestoneId, input.goalId);
        if (!milestone.success) return milestone;
      }
      try {
        const created = await repository.create({
          goalId: input.goalId,
          milestoneId: input.milestoneId ?? null,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          status: "TODO"
        });
        if (created.goalId !== input.goalId ||
            created.milestoneId !== (input.milestoneId ?? null)) {
          return fail("ACTION_PERSISTENCE_ERROR");
        }
        return ok(created);
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async getAction(user, actionId) {
      return resolve(user, actionId);
    },

    async listActionsByGoal(user, goalId) {
      if (!authenticated(user)) return fail("ACTION_UNAUTHENTICATED");
      const goal = await checkGoal(user, goalId);
      if (!goal.success) return goal;
      try {
        const actions = await repository.listByGoal(goalId);
        return ok(actions.filter(action => action.archivedAt === null));
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async listActionsByMilestone(user, milestoneId) {
      if (!authenticated(user)) return fail("ACTION_UNAUTHENTICATED");
      // Validate the Milestone through B04 first. Goal ID is obtained from B04.
      // This starter's B04 adapter must resolve the owning Goal in its contract.
      try {
        const actions = await repository.listByMilestone(milestoneId);
        const visible: Action[] = [];
        for (const action of actions) {
          if (action.milestoneId !== milestoneId || action.archivedAt !== null) continue;
          const resolved = await resolve(user, action.id);
          if (resolved.success) visible.push(action);
        }
        return ok(visible);
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async updateAction(user, actionId, input) {
      const existing = await resolve(user, actionId);
      if (!existing.success) return existing;
      const validation = validateUpdateActionInput(input);
      if (!validation.valid) return fail(validation.code);
      if (existing.data.status === "COMPLETED") return fail("ACTION_UPDATE_NOT_ALLOWED");
      try {
        const updated = await repository.update(actionId, {
          ...(input.title !== undefined ? { title: input.title.trim() } : {}),
          ...(input.description !== undefined
            ? { description: input.description?.trim() || null } : {})
        });
        if (updated.id !== existing.data.id ||
            updated.goalId !== existing.data.goalId ||
            updated.milestoneId !== existing.data.milestoneId) {
          return fail("ACTION_PERSISTENCE_ERROR");
        }
        return ok(updated);
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async updateActionStatus(user, actionId, status) {
      const existing = await resolve(user, actionId);
      if (!existing.success) return existing;
      if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return fail("ACTION_INVALID_STATUS");
      }
      if (existing.data.status === "COMPLETED") return fail("ACTION_ALREADY_COMPLETED");
      const allowed: Record<ActionStatus, ActionStatus[]> = {
        TODO: ["IN_PROGRESS", "COMPLETED"],
        IN_PROGRESS: ["COMPLETED"],
        COMPLETED: []
      };
      if (!allowed[existing.data.status].includes(status)) {
        return fail("ACTION_INVALID_STATUS_TRANSITION");
      }
      // Direct TODO -> COMPLETED remains a proposed transition; C05 must confirm it.
      try {
        const completedAt = status === "COMPLETED" ? now() : null;
        return ok(await repository.updateStatus(actionId, status, completedAt));
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async completeAction(user, actionId, input = {}) {
      const existing = await resolve(user, actionId);
      if (!existing.success) return existing;
      if (existing.data.status === "COMPLETED") return fail("ACTION_ALREADY_COMPLETED");
      try {
        if (input.executionNote !== undefined) {
          const saved = await repository.saveExecution(actionId, {
            executionNote: input.executionNote
          });
          void saved;
        }
        const completed = await repository.updateStatus(actionId, "COMPLETED", now());
        return ok(completed);
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async recordExecution(user, actionId, input) {
      const existing = await resolve(user, actionId);
      if (!existing.success) return existing;
      const validation = validateExecutionInput(input);
      if (!validation.valid) return fail(validation.code);
      try {
        return ok(await repository.saveExecution(actionId, input));
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    },

    async getExecutionData(user, actionId) {
      const existing = await resolve(user, actionId);
      if (!existing.success) return existing;
      try {
        return ok(await repository.getExecution(actionId));
      } catch { return fail("ACTION_PERSISTENCE_ERROR"); }
    }
  };
}
