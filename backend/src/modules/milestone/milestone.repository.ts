import type {
  CreateMilestoneInput,
  Milestone,
  UpdateMilestoneInput
} from "./milestone.types";

/**
 * D01 boundary. A production adapter must enforce the Goal foreign key
 * and persist completion timestamps consistently.
 */
export interface MilestoneRepository {
  createMilestone(input: {
    goalId: string;
    title: string;
    description: string | null;
    targetDate: string | null;
  }): Promise<Milestone>;

  findMilestoneById(milestoneId: string): Promise<Milestone | null>;

  listMilestonesByGoal(goalId: string): Promise<Milestone[]>;

  updateMilestone(
    milestoneId: string,
    input: UpdateMilestoneInput
  ): Promise<Milestone>;

  completeMilestone(
    milestoneId: string,
    completedAt: string
  ): Promise<Milestone>;
}

/**
 * B03 boundary. Use B03's GoalService.getGoal() to resolve the Goal
 * through the authenticated user context. Do not query B03 tables directly.
 */
export interface MilestoneGoalAccess {
  getGoalForUser(
    user: { userId: string; email: string | null; isAuthenticated: true },
    goalId: string
  ): Promise<
    | { success: true; data: { id: string; status?: string; archivedAt?: string | null } }
    | { success: false; error: { code: string; message: string } }
  >;
}
