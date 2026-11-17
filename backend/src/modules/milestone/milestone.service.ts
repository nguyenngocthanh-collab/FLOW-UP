import { createMilestoneError } from "./milestone.errors";
import type {
  AuthenticatedUserContext,
  CreateMilestoneInput,
  Milestone,
  MilestoneResult,
  UpdateMilestoneInput
} from "./milestone.types";
import type {
  MilestoneGoalAccess,
  MilestoneRepository
} from "./milestone.repository";
import {
  validateCreateMilestoneInput,
  validateUpdateMilestoneInput
} from "./milestone.validation";

function success<T>(data: T): MilestoneResult<T> {
  return { success: true, data };
}

function failure<T>(
  code: Parameters<typeof createMilestoneError>[0]
): MilestoneResult<T> {
  return { success: false, error: createMilestoneError(code) };
}

function isAuthenticated(
  user: AuthenticatedUserContext | null | undefined
): user is AuthenticatedUserContext {
  return Boolean(
    user &&
    user.isAuthenticated === true &&
    typeof user.userId === "string" &&
    user.userId.trim().length > 0
  );
}

function normalizePersistenceError<T>(): MilestoneResult<T> {
  return failure("MILESTONE_PERSISTENCE_ERROR");
}

export interface MilestoneService {
  createMilestone(
    user: AuthenticatedUserContext,
    input: CreateMilestoneInput
  ): Promise<MilestoneResult<Milestone>>;

  getMilestone(
    user: AuthenticatedUserContext,
    milestoneId: string
  ): Promise<MilestoneResult<Milestone>>;

  listMilestonesByGoal(
    user: AuthenticatedUserContext,
    goalId: string
  ): Promise<MilestoneResult<Milestone[]>>;

  updateMilestone(
    user: AuthenticatedUserContext,
    milestoneId: string,
    input: UpdateMilestoneInput
  ): Promise<MilestoneResult<Milestone>>;

  completeMilestone(
    user: AuthenticatedUserContext,
    milestoneId: string
  ): Promise<MilestoneResult<Milestone>>;
}

export function createMilestoneService(
  repository: MilestoneRepository,
  goalAccess: MilestoneGoalAccess,
  now: () => string = () => new Date().toISOString()
): MilestoneService {
  async function resolveMilestone(
    user: AuthenticatedUserContext,
    milestoneId: string
  ): Promise<MilestoneResult<Milestone>> {
    if (!isAuthenticated(user)) {
      return failure("MILESTONE_UNAUTHENTICATED");
    }
    if (!milestoneId?.trim()) return failure("MILESTONE_NOT_FOUND");

    try {
      const milestone = await repository.findMilestoneById(milestoneId);
      if (!milestone) return failure("MILESTONE_NOT_FOUND");

      const goalResult = await goalAccess.getGoalForUser(user, milestone.goalId);
      if (!goalResult.success) {
        if (goalResult.error.code === "GOAL_NOT_FOUND") {
          return failure("MILESTONE_GOAL_NOT_FOUND");
        }
        return failure("MILESTONE_ACCESS_DENIED");
      }

      return success(milestone);
    } catch {
      return normalizePersistenceError();
    }
  }

  async function validateGoalAccess(
    user: AuthenticatedUserContext,
    goalId: string
  ): Promise<MilestoneResult<true>> {
    try {
      const result = await goalAccess.getGoalForUser(user, goalId);
      if (result.success) return success(true);
      if (result.error.code === "GOAL_NOT_FOUND") {
        return failure("MILESTONE_GOAL_NOT_FOUND");
      }
      if (result.error.code === "GOAL_ACCESS_DENIED") {
        return failure("MILESTONE_GOAL_ACCESS_DENIED");
      }
      return failure("MILESTONE_GOAL_INVALID");
    } catch {
      return normalizePersistenceError();
    }
  }

  return {
    async createMilestone(user, input) {
      if (!isAuthenticated(user)) {
        return failure("MILESTONE_UNAUTHENTICATED");
      }

      const validation = validateCreateMilestoneInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "MILESTONE_INVALID_INPUT");
      }

      const goalResult = await validateGoalAccess(user, input.goalId);
      if (!goalResult.success) return goalResult;

      try {
        const milestone = await repository.createMilestone({
          goalId: input.goalId,
          title: input.title.trim(),
          description:
            input.description === undefined || input.description === null
              ? null
              : input.description.trim() || null,
          targetDate: input.targetDate ?? null
        });
        if (milestone.goalId !== input.goalId) {
          return failure("MILESTONE_PERSISTENCE_ERROR");
        }
        return success(milestone);
      } catch {
        return normalizePersistenceError();
      }
    },

    async getMilestone(user, milestoneId) {
      return resolveMilestone(user, milestoneId);
    },

    async listMilestonesByGoal(user, goalId) {
      if (!isAuthenticated(user)) {
        return failure("MILESTONE_UNAUTHENTICATED");
      }
      if (!goalId?.trim()) return failure("MILESTONE_GOAL_NOT_FOUND");

      const goalResult = await validateGoalAccess(user, goalId);
      if (!goalResult.success) return goalResult;

      try {
        return success(await repository.listMilestonesByGoal(goalId));
      } catch {
        return normalizePersistenceError();
      }
    },

    async updateMilestone(user, milestoneId, input) {
      const existing = await resolveMilestone(user, milestoneId);
      if (!existing.success) return existing;

      const validation = validateUpdateMilestoneInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "MILESTONE_INVALID_INPUT");
      }
      if (existing.data.status === "COMPLETED") {
        return failure("MILESTONE_UPDATE_NOT_ALLOWED");
      }

      const safeInput: UpdateMilestoneInput = {};
      if (input.title !== undefined) safeInput.title = input.title.trim();
      if (input.description !== undefined) {
        safeInput.description =
          input.description === null ? null : input.description.trim() || null;
      }
      if (input.targetDate !== undefined) safeInput.targetDate = input.targetDate;

      try {
        const updated = await repository.updateMilestone(milestoneId, safeInput);
        if (
          updated.id !== existing.data.id ||
          updated.goalId !== existing.data.goalId
        ) {
          return failure("MILESTONE_PERSISTENCE_ERROR");
        }
        return success(updated);
      } catch {
        return normalizePersistenceError();
      }
    },

    async completeMilestone(user, milestoneId) {
      const existing = await resolveMilestone(user, milestoneId);
      if (!existing.success) return existing;
      if (existing.data.status === "COMPLETED") {
        return failure("MILESTONE_ALREADY_COMPLETED");
      }

      try {
        const completed = await repository.completeMilestone(
          milestoneId,
          now()
        );
        if (
          completed.id !== existing.data.id ||
          completed.goalId !== existing.data.goalId ||
          completed.status !== "COMPLETED" ||
          completed.completedAt === null
        ) {
          return failure("MILESTONE_PERSISTENCE_ERROR");
        }
        return success(completed);
      } catch {
        return normalizePersistenceError();
      }
    }
  };
}
