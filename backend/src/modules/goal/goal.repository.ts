import type {
  CreateGoalInput,
  Goal,
  ListGoalsFilter,
  UpdateGoalInput
} from "./goal.types";

/**
 * D01 persistence boundary.
 * Implementations must enforce foreign keys and atomic writes for hierarchy changes.
 * Workspace/project ownership must not be inferred from IDs supplied by the client.
 */
export interface GoalRepository {
  createGoal(workspaceId: string, input: CreateGoalInput): Promise<Goal>;
  findGoalById(goalId: string): Promise<Goal | null>;
  listGoalsByWorkspaceId(
    workspaceId: string,
    filter?: ListGoalsFilter
  ): Promise<Goal[]>;
  updateGoal(goalId: string, input: UpdateGoalInput): Promise<Goal>;
  findDescendantIds(goalId: string): Promise<string[]>;
}

/**
 * B02 boundary. Implement this adapter using B02 ownership validation operations.
 */
export interface GoalWorkspaceAccess {
  getCurrentWorkspaceId(userId: string): Promise<string | null>;
  validateProjectInWorkspace(
    userId: string,
    workspaceId: string,
    projectId: string
  ): Promise<boolean>;
}
