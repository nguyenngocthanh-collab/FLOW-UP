import {
  DailyPlan, DailyPlanUserFacts, Schedule, ScheduleActionFacts, ScheduleDailyPlanFacts,
} from "./planning.types";
import { PlanningError, PlanningErrorCode, planningError } from "./planning.errors";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: PlanningError };

const ok: ValidationResult = { valid: true };
function fail(code: PlanningErrorCode, message: string, field?: string): ValidationResult {
  return { valid: false, error: planningError(code, message, field) };
}

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidInstant(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Date.parse(value));
}

export function validateDailyPlan(plan: DailyPlan, facts: DailyPlanUserFacts): ValidationResult {
  if (!plan.id) return fail("DAILY_PLAN_INVALID_ID", "Daily Plan ID is required.", "id");
  if (!plan.userId) return fail("DAILY_PLAN_USER_REQUIRED", "User ID is required.", "userId");
  if (!facts.userExists) return fail("DAILY_PLAN_OWNER_INVALID", "Owning User does not exist.", "userId");
  if (!facts.accessible) return fail("DAILY_PLAN_ACCESS_DENIED", "User context is not accessible.");
  if (!isCalendarDate(plan.date)) return fail("DAILY_PLAN_DATE_INVALID", "Date must be a real YYYY-MM-DD calendar date.", "date");
  if (!isValidInstant(plan.createdAt) || !isValidInstant(plan.updatedAt)) {
    return fail("PLANNING_VALIDATION_FAILED", "Daily Plan timestamps must be valid.");
  }
  return ok;
}

export function validateScheduleAction(actionId: unknown, facts: ScheduleActionFacts): ValidationResult {
  if (typeof actionId !== "string" || !actionId.trim()) {
    return fail("SCHEDULE_ACTION_REQUIRED", "An Action reference is required.", "actionId");
  }
  if (!facts.actionExists) return fail("SCHEDULE_ACTION_NOT_FOUND", "Referenced Action does not exist.", "actionId");
  if (!facts.accessible) return fail("SCHEDULE_ACCESS_DENIED", "Referenced Action is not accessible.");
  return ok;
}

export function validateScheduleDailyPlan(
  dailyPlanId: string | null | undefined,
  facts?: ScheduleDailyPlanFacts,
): ValidationResult {
  // Daily Plan association is OPEN/optional; absence is not rejected here.
  if (dailyPlanId == null) return ok;
  if (!facts || !facts.exists) return fail("SCHEDULE_DAILY_PLAN_NOT_FOUND", "Referenced Daily Plan does not exist.");
  if (!facts.belongsToUser) return fail("SCHEDULE_DAILY_PLAN_INVALID", "Daily Plan does not belong to the scheduling User.");
  return ok;
}

export function validateScheduleTimeRange(startAt: unknown, endAt: unknown): ValidationResult {
  if (!isValidInstant(startAt)) return fail("SCHEDULE_START_INVALID", "Start must be a valid timestamp.", "startAt");
  if (!isValidInstant(endAt)) return fail("SCHEDULE_END_INVALID", "End must be a valid timestamp.", "endAt");
  if (Date.parse(endAt) <= Date.parse(startAt)) {
    return fail("SCHEDULE_TIME_RANGE_INVALID", "End must be after start.", "endAt");
  }
  return ok;
}

export function validateSchedule(
  schedule: Schedule,
  actionFacts: ScheduleActionFacts,
  dailyPlanFacts?: ScheduleDailyPlanFacts,
): ValidationResult {
  if (!schedule.id) return fail("SCHEDULE_INVALID_ID", "Schedule ID is required.", "id");
  const action = validateScheduleAction(schedule.actionId, actionFacts);
  if (!action.valid) return action;
  const plan = validateScheduleDailyPlan(schedule.dailyPlanId, dailyPlanFacts);
  if (!plan.valid) return plan;
  const range = validateScheduleTimeRange(schedule.startAt, schedule.endAt);
  if (!range.valid) return range;
  if (!isValidInstant(schedule.createdAt) || !isValidInstant(schedule.updatedAt)) {
    return fail("PLANNING_VALIDATION_FAILED", "Schedule timestamps must be valid.");
  }
  return ok;
}

/** Reports overlaps only. It deliberately does not decide warning vs rejection. */
export function detectScheduleOverlap(a: Pick<Schedule, "startAt" | "endAt">, b: Pick<Schedule, "startAt" | "endAt">): boolean {
  if (!validateScheduleTimeRange(a.startAt, a.endAt).valid ||
      !validateScheduleTimeRange(b.startAt, b.endAt).valid) return false;
  return Date.parse(a.startAt) < Date.parse(b.endAt) &&
    Date.parse(b.startAt) < Date.parse(a.endAt);
}

export function validateApprovedPlanningProposal(
  proposal: { approved: boolean; schedules: readonly unknown[] },
): ValidationResult {
  if (!proposal || !Array.isArray(proposal.schedules) || proposal.schedules.length === 0) {
    return fail("PLANNING_PROPOSAL_INVALID", "Proposal must contain at least one Schedule item.");
  }
  if (proposal.approved !== true) {
    return fail("PLANNING_PROPOSAL_NOT_APPROVED", "Proposal must be approved by the User before application.");
  }
  return ok;
}
