import type { AuthenticatedUserContext } from "../auth/auth.types";

export type { AuthenticatedUserContext };

/**
 * PENDING / COMPLETED are the proposed MVP values in the B04 specification.
 * Final domain approval is still required (C04).
 */
export type MilestoneStatus = "PENDING" | "COMPLETED";

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: MilestoneStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateMilestoneInput {
  goalId: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
}

export interface UpdateMilestoneInput {
  title?: string;
  description?: string | null;
  targetDate?: string | null;
}

export type MilestoneResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        code: MilestoneErrorCode;
        message: string;
      };
    };

export type MilestoneErrorCode =
  | "MILESTONE_NOT_FOUND"
  | "MILESTONE_ACCESS_DENIED"
  | "MILESTONE_UNAUTHENTICATED"
  | "MILESTONE_INVALID_TITLE"
  | "MILESTONE_INVALID_INPUT"
  | "MILESTONE_GOAL_NOT_FOUND"
  | "MILESTONE_GOAL_ACCESS_DENIED"
  | "MILESTONE_GOAL_INVALID"
  | "MILESTONE_ACTION_NOT_FOUND"
  | "MILESTONE_ACTION_RELATION_INVALID"
  | "MILESTONE_ALREADY_COMPLETED"
  | "MILESTONE_COMPLETION_NOT_ALLOWED"
  | "MILESTONE_UPDATE_NOT_ALLOWED"
  | "MILESTONE_PERSISTENCE_ERROR"
  | "MILESTONE_UNKNOWN_ERROR";
