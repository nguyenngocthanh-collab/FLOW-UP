import { describe, expect, it, vi } from "vitest";
import { createGoalService } from "../../src/modules/goal/goal.service";
import type {
  GoalRepository,
  GoalWorkspaceAccess
} from "../../src/modules/goal/goal.repository";
import type { Goal } from "../../src/modules/goal/goal.types";

const user = {
  userId: "user-1",
  email: "user@example.com",
  isAuthenticated: true as const
};

const goal: Goal = {
  id: "goal-1",
  workspaceId: "workspace-1",
  projectId: null,
  parentGoalId: null,
  title: "Complete FLOW-UP MVP",
  description: null,
  targetDate: null,
  status: "ACTIVE",
  createdAt: "2026-11-17T00:00:00.000Z",
  updatedAt: "2026-11-17T00:00:00.000Z",
  archivedAt: null
};

function makeRepository(): GoalRepository {
  return {
    createGoal: vi.fn(async (_workspaceId, input) => ({
      ...goal,
      ...input,
      id: "goal-created",
      workspaceId: "workspace-1",
      projectId: input.projectId ?? null,
      parentGoalId: input.parentGoalId ?? null,
      title: input.title,
      description: input.description ?? null,
      targetDate: input.targetDate ?? null
    })),
    findGoalById: vi.fn(async (id) => id === "goal-1" ? goal : null),
    listGoalsByWorkspaceId: vi.fn(async () => [goal]),
    updateGoal: vi.fn(async (_id, input) => ({
      ...goal,
      ...input,
      title: input.title ?? goal.title,
      description: input.description === undefined ? goal.description : input.description,
      targetDate: input.targetDate === undefined ? goal.targetDate : input.targetDate
    })),
    moveGoal: vi.fn(async (id, parentGoalId) => ({ ...goal, id, parentGoalId, updatedAt: new Date().toISOString() })),
    findDescendantIds: vi.fn(async () => [])
  };
}

function makeWorkspaceAccess(): GoalWorkspaceAccess {
  return {
    getCurrentWorkspaceId: vi.fn(async () => "workspace-1"),
    validateProjectInWorkspace: vi.fn(async () => true)
  };
}

describe("B03 Goal service", () => {
  it("creates an independent Goal in the authenticated Workspace", async () => {
    const repository = makeRepository();
    const service = createGoalService(repository, makeWorkspaceAccess());

    const result = await service.createGoal(user, {
      title: "  Complete FLOW-UP MVP  "
    });

    expect(result.success).toBe(true);
    expect(repository.createGoal).toHaveBeenCalledWith("workspace-1", {
      title: "Complete FLOW-UP MVP",
      description: null,
      targetDate: null,
      projectId: null,
      parentGoalId: null
    });
  });

  it("rejects an invalid title", async () => {
    const repository = makeRepository();
    const service = createGoalService(repository, makeWorkspaceAccess());

    const result = await service.createGoal(user, { title: " " });

    expect(result).toMatchObject({
      success: false,
      error: { code: "GOAL_INVALID_TITLE" }
    });
    expect(repository.createGoal).not.toHaveBeenCalled();
  });

  it("rejects access to a Goal outside the current Workspace", async () => {
    const repository = makeRepository();
    repository.findGoalById = vi.fn(async () => ({
      ...goal,
      workspaceId: "workspace-other"
    }));
    const service = createGoalService(repository, makeWorkspaceAccess());

    const result = await service.getGoal(user, "goal-other");

    expect(result).toMatchObject({
      success: false,
      error: { code: "GOAL_ACCESS_DENIED" }
    });
  });

  it("rejects unauthenticated requests", async () => {
    const service = createGoalService(makeRepository(), makeWorkspaceAccess());

    const result = await service.listGoals({
      userId: "",
      email: null,
      isAuthenticated: true
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "GOAL_UNAUTHENTICATED" }
    });
  });

  it("moves a Goal under another Goal in the same workspace and project", async () => {
    const repository = makeRepository();
    const parent: Goal = { ...goal, id: "goal-parent" };
    const child: Goal = { ...goal, id: "goal-child" };
    repository.findGoalById = vi.fn(async (id) =>
      id === "goal-parent" ? parent : id === "goal-child" ? child : null
    );
    repository.findDescendantIds = vi.fn(async () => []);
    repository.moveGoal = vi.fn(async (id, parentGoalId) => ({ ...child, id, parentGoalId }));
    const service = createGoalService(repository, makeWorkspaceAccess());
    const result = await service.moveGoal(user, "goal-child", "goal-parent");
    expect(result).toMatchObject({ success: true, data: { id: "goal-child", parentGoalId: "goal-parent" } });
    expect(repository.moveGoal).toHaveBeenCalledWith("goal-child", "goal-parent");
  });

  it("rejects a move that would create a hierarchy cycle", async () => {
    const repository = makeRepository();
    const parent: Goal = { ...goal, id: "goal-parent" };
    const child: Goal = { ...goal, id: "goal-child" };
    repository.findGoalById = vi.fn(async (id) =>
      id === "goal-parent" ? parent : id === "goal-child" ? child : null
    );
    repository.findDescendantIds = vi.fn(async () => ["goal-parent"]);
    const service = createGoalService(repository, makeWorkspaceAccess());
    const result = await service.moveGoal(user, "goal-child", "goal-parent");
    expect(result).toMatchObject({ success: false, error: { code: "GOAL_CIRCULAR_REFERENCE" } });
    expect(repository.moveGoal).not.toHaveBeenCalled();
  });

});
