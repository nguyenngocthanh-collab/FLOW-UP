import type { AuthenticatedUserContext } from "../auth/auth.types";

export type { AuthenticatedUserContext };

export type GoalStatus = string;

export interface Goal {
  id: string;
  workspaceId: string;
  projectId: string | null;
  parentGoalId: string | null;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface CreateGoalInput {
  title: string;
  description?: string | null;
  targetDate?: string | null;
  projectId?: string | null;
  parentGoalId?: string | null;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string | null;
  targetDate?: string | null;
}

export interface ListGoalsFilter {
  projectId?: string;
  parentGoalId?: string | null;
  status?: string;
  includeArchived?: boolean;
}

export interface GoalHierarchyNode {
  goal: Goal;
  children: GoalHierarchyNode[];
}

export interface GoalScope {
  projectId?: string;
  rootGoalId?: string;
  includeArchived?: boolean;
}

export type GoalErrorCode =
  | "GOAL_NOT_FOUND"
  | "GOAL_ACCESS_DENIED"
  | "GOAL_UNAUTHENTICATED"
  | "GOAL_INVALID_TITLE"
  | "GOAL_INVALID_INPUT"
  | "GOAL_PARENT_NOT_FOUND"
  | "GOAL_PARENT_INVALID"
  | "GOAL_CIRCULAR_REFERENCE"
  | "GOAL_INVALID_HIERARCHY"
  | "GOAL_INVALID_PLACEMENT"
  | "GOAL_OWNERSHIP_MISMATCH"
  | "GOAL_PERSISTENCE_ERROR"
  | "GOAL_UNKNOWN_ERROR";

export interface GoalError {
  code: GoalErrorCode;
  message: string;
}

export type GoalResult<T> =
  | { success: true; data: T }
  | { success: false; error: GoalError };

export interface GoalService {
  createGoal(
    user: AuthenticatedUserContext,
    input: CreateGoalInput
  ): Promise<GoalResult<Goal>>;

  getGoal(
    user: AuthenticatedUserContext,
    goalId: string
  ): Promise<GoalResult<Goal>>;

  listGoals(
    user: AuthenticatedUserContext,
    filter?: ListGoalsFilter
  ): Promise<GoalResult<Goal[]>>;

  updateGoal(
    user: AuthenticatedUserContext,
    goalId: string,
    input: UpdateGoalInput
  ): Promise<GoalResult<Goal>>;

  addChildGoal(
    user: AuthenticatedUserContext,
    parentGoalId: string,
    input: Omit<CreateGoalInput, "projectId" | "parentGoalId">
  ): Promise<GoalResult<Goal>>;

  getGoalHierarchy(
    user: AuthenticatedUserContext,
    scope?: GoalScope
  ): Promise<GoalResult<GoalHierarchyNode[]>>;

  validateParentChild(
    user: AuthenticatedUserContext,
    parentGoalId: string,
    childGoalId: string
  ): Promise<GoalResult<boolean>>;
}
