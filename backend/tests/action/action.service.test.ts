import { describe, expect, it, vi } from "vitest";
import { createActionService } from "../../src/modules/action/action.service";
import type {
  ActionGoalAccess,
  ActionMilestoneAccess,
  ActionRepository
} from "../../src/modules/action/action.repository";
import type { Action } from "../../src/modules/action/action.types";

const user = {
  userId: "user-1",
  email: "user@example.com",
  isAuthenticated: true as const
};

const action: Action = {
  id: "action-1",
  goalId: "goal-1",
  milestoneId: null,
  title: "Complete reading test",
  description: null,
  status: "TODO",
  createdAt: "2026-11-17T00:00:00.000Z",
  updatedAt: "2026-11-17T00:00:00.000Z",
  completedAt: null,
  archivedAt: null
};

function repository(): ActionRepository {
  return {
    create: vi.fn(async input => ({ ...action, ...input, id: "action-new" })),
    findById: vi.fn(async id => id === action.id ? action : null),
    listByGoal: vi.fn(async () => [action]),
    listByMilestone: vi.fn(async () => []),
    update: vi.fn(async (_id, input) => ({ ...action, ...input })),
    updateStatus: vi.fn(async (_id, status, completedAt) => ({
      ...action, status, completedAt
    })),
    saveExecution: vi.fn(async (_actionId, input) => ({
      actionId: action.id,
      actualStartedAt: input.actualStartedAt ?? null,
      actualCompletedAt: input.actualCompletedAt ?? null,
      actualDurationMinutes: input.actualDurationMinutes ?? null,
      executionNote: input.executionNote ?? null
    })),
    getExecution: vi.fn(async () => null)
  };
}

function goalAccess(): ActionGoalAccess {
  return {
    validateGoal: vi.fn(async () => ({
      success: true as const, data: { id: "goal-1" }
    }))
  };
}

function milestoneAccess(): ActionMilestoneAccess {
  return {
    validateMilestone: vi.fn(async (_user, id, goalId) => ({
      success: true as const, data: { id, goalId }
    }))
  };
}

describe("B05 Action service", () => {
  it("creates an Action after validating Goal", async () => {
    const repo = repository();
    const service = createActionService(repo, goalAccess(), milestoneAccess());

    const result = await service.createAction(user, {
      goalId: "goal-1",
      title: "  Complete reading test  "
    });

    expect(result.success).toBe(true);
    expect(repo.create).toHaveBeenCalledWith({
      goalId: "goal-1",
      milestoneId: null,
      title: "Complete reading test",
      description: null,
      status: "TODO"
    });
  });

  it("rejects a Milestone associated with another Goal", async () => {
    const access = milestoneAccess();
    access.validateMilestone = vi.fn(async () => ({
      success: true as const,
      data: { id: "milestone-1", goalId: "different-goal" }
    }));
    const repo = repository();
    const service = createActionService(repo, goalAccess(), access);

    const result = await service.createAction(user, {
      goalId: "goal-1",
      milestoneId: "milestone-1",
      title: "Practice"
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "ACTION_INVALID_ASSOCIATION" }
    });
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("updates Action to IN_PROGRESS", async () => {
    const repo = repository();
    const service = createActionService(repo, goalAccess(), milestoneAccess());

    const result = await service.updateActionStatus(user, "action-1", "IN_PROGRESS");

    expect(result).toMatchObject({
      success: true,
      data: { status: "IN_PROGRESS" }
    });
  });

  it("records execution data", async () => {
    const repo = repository();
    const service = createActionService(repo, goalAccess(), milestoneAccess());

    const result = await service.recordExecution(user, "action-1", {
      actualDurationMinutes: 35,
      executionNote: "Reviewed mistakes"
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        actualDurationMinutes: 35,
        executionNote: "Reviewed mistakes"
      }
    });
  });
});
