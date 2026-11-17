export type ActionStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface Action {
  id: string;
  goalId: string;
  milestoneId: string | null;
  title: string;
  description: string | null;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  archivedAt: string | null;
}

export interface ActionExecutionData {
  actionId: string;
  actualStartedAt: string | null;
  actualCompletedAt: string | null;
  actualDurationMinutes: number | null;
  executionNote: string | null;
}

export interface CreateActionInput {
  goalId: string;
  milestoneId?: string | null;
  title: string;
  description?: string | null;
}

export interface UpdateActionInput {
  title?: string;
  description?: string | null;
}

export interface RecordExecutionInput {
  actualStartedAt?: string | null;
  actualCompletedAt?: string | null;
  actualDurationMinutes?: number | null;
  executionNote?: string | null;
}

export type ActionErrorCode =
  | "ACTION_NOT_FOUND"
  | "ACTION_ACCESS_DENIED"
  | "ACTION_UNAUTHENTICATED"
  | "ACTION_INVALID_TITLE"
  | "ACTION_INVALID_INPUT"
  | "ACTION_INVALID_STATUS"
  | "ACTION_INVALID_STATUS_TRANSITION"
  | "ACTION_ALREADY_COMPLETED"
  | "ACTION_COMPLETION_NOT_ALLOWED"
  | "ACTION_UPDATE_NOT_ALLOWED"
  | "ACTION_ARCHIVE_NOT_ALLOWED"
  | "ACTION_DELETE_NOT_ALLOWED"
  | "ACTION_GOAL_NOT_FOUND"
  | "ACTION_GOAL_ACCESS_DENIED"
  | "ACTION_MILESTONE_NOT_FOUND"
  | "ACTION_MILESTONE_ACCESS_DENIED"
  | "ACTION_INVALID_ASSOCIATION"
  | "ACTION_INVALID_EXECUTION_DATA"
  | "ACTION_INVALID_TIME_RANGE"
  | "ACTION_PERSISTENCE_ERROR"
  | "ACTION_UNKNOWN_ERROR";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: ActionErrorCode; message: string } };
