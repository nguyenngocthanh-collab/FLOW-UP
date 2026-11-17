import { describe, expect, it, vi } from "vitest";
import { createMilestoneService } from "../../src/modules/milestone/milestone.service";
import type {
  MilestoneGoalAccess,
  MilestoneRepository
} from "../../src/modules/milestone/milestone.repository";
import type { Milestone } from "../../src/modules/milestone/milestone.types";

const user = {
  userId: "user-1",
  email: "user@example.com",
  isAuthenticated: true as const
};

const milestone: Milestone = {
  id: "milestone-1",
  goalId: "goal-1",
  title: "Reach Reading Band 6.0",
  description: null,
  targetDate: null,
  status: "PENDING",
  createdAt: "2026-11-17T00:00:00.000Z",
  updatedAt: "2026-11-17T00:00:00.000Z",
  completedAt: null
};

function makeRepository(): MilestoneRepository {
  return {
    createMilestone: vi.fn(async (input) => ({
      ...milestone,
      ...input,
      id: "milestone-created"
    })),
    findMilestoneById: vi.fn(async (id) =>
      id === milestone.id ? milestone : null
    ),
    listMilestonesByGoal: vi.fn(async () => [milestone]),
    updateMilestone: vi.fn(async (_id, input) => ({
      ...milestone,
      ...input,
      title: input.title ?? milestone.title,
      description: input.description === undefined
        ? milestone.description
        : input.description,
      targetDate: input.targetDate === undefined
        ? milestone.targetDate
        : input.targetDate
    })),
    completeMilestone: vi.fn(async (_id, completedAt) => ({
      ...milestone,
      status: "COMPLETED" as const,
      completedAt,
      updatedAt: completedAt
    }))
  };
}

function makeGoalAccess(): MilestoneGoalAccess {
  return {
    getGoalForUser: vi.fn(async () => ({
      success: true as const,
      data: { id: "goal-1", status: "ACTIVE", archivedAt: null }
    }))
  };
}

describe("B04 Milestone service", () => {
  it("creates a Milestone after validating its owning Goal", async () => {
    const repository = makeRepository();
    const goalAccess = makeGoalAccess();
    const service = createMilestoneService(repository, goalAccess);

    const result = await service.createMilestone(user, {
      goalId: "goal-1",
      title: "  Reach Reading Band 6.0  "
    });

    expect(result.success).toBe(true);
    expect(goalAccess.getGoalForUser).toHaveBeenCalledWith(user, "goal-1");
    expect(repository.createMilestone).toHaveBeenCalledWith({
      goalId: "goal-1",
      title: "Reach Reading Band 6.0",
      description: null,
      targetDate: null
    });
  });

  it("rejects creation when the Goal does not exist", async () => {
    const goalAccess = makeGoalAccess();
    goalAccess.getGoalForUser = vi.fn(async () => ({
      success: false as const,
      error: { code: "GOAL_NOT_FOUND", message: "Not found" }
    }));
    const repository = makeRepository();
    const service = createMilestoneService(repository, goalAccess);

    const result = await service.createMilestone(user, {
      goalId: "missing-goal",
      title: "Milestone"
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "MILESTONE_GOAL_NOT_FOUND" }
    });
    expect(repository.createMilestone).not.toHaveBeenCalled();
  });

  it("completes a Milestone and records completedAt", async () => {
    const repository = makeRepository();
    const service = createMilestoneService(
      repository,
      makeGoalAccess(),
      () => "2026-11-17T10:00:00.000Z"
    );

    const result = await service.completeMilestone(user, "milestone-1");

    expect(result).toMatchObject({
      success: true,
      data: {
        status: "COMPLETED",
        completedAt: "2026-11-17T10:00:00.000Z"
      }
    });
  });

  it("rejects unauthenticated access", async () => {
    const service = createMilestoneService(
      makeRepository(),
      makeGoalAccess()
    );

    const result = await service.listMilestonesByGoal({
      userId: "",
      email: null,
      isAuthenticated: true
    }, "goal-1");

    expect(result).toMatchObject({
      success: false,
      error: { code: "MILESTONE_UNAUTHENTICATED" }
    });
  });
});
