export type PlanningErrorCode =
  | "DAILY_PLAN_NOT_FOUND"
  | "DAILY_PLAN_ACCESS_DENIED"
  | "DAILY_PLAN_INVALID_ID"
  | "DAILY_PLAN_USER_REQUIRED"
  | "DAILY_PLAN_OWNER_INVALID"
  | "DAILY_PLAN_DATE_INVALID"
  | "SCHEDULE_NOT_FOUND"
  | "SCHEDULE_ACCESS_DENIED"
  | "SCHEDULE_INVALID_ID"
  | "SCHEDULE_ACTION_REQUIRED"
  | "SCHEDULE_ACTION_NOT_FOUND"
  | "SCHEDULE_ACTION_INVALID"
  | "SCHEDULE_DAILY_PLAN_NOT_FOUND"
  | "SCHEDULE_DAILY_PLAN_INVALID"
  | "SCHEDULE_OWNERSHIP_INVALID"
  | "SCHEDULE_START_INVALID"
  | "SCHEDULE_END_INVALID"
  | "SCHEDULE_TIME_RANGE_INVALID"
  | "SCHEDULE_TIMEZONE_INVALID"
  | "SCHEDULE_CONFLICT_DETECTED"
  | "PLANNING_PROPOSAL_INVALID"
  | "PLANNING_PROPOSAL_NOT_APPROVED"
  | "PLANNING_VALIDATION_FAILED";

export interface PlanningError {
  code: PlanningErrorCode;
  message: string;
  field?: string;
}

export type PlanningResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: PlanningError };

export function planningError(code: PlanningErrorCode, message: string, field?: string): PlanningError {
  return field ? { code, message, field } : { code, message };
}
