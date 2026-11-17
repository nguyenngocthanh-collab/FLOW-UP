import { PlanningError } from "./planning.errors";
import type {
  CreateDailyPlanInput, CreateScheduleInput, PlanningDateRange, UpdateDailyPlanInput,
  UpdateScheduleInput,
} from "./planning.types";

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
    && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

function validDateTime(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function validateDailyPlanInput(input: CreateDailyPlanInput | UpdateDailyPlanInput): void {
  if (input.date !== undefined && !validDate(input.date)) {
    throw new PlanningError("DAILY_PLAN_INVALID_DATE", "Date must be a valid YYYY-MM-DD date.");
  }
  if (Object.keys(input).length === 0) {
    throw new PlanningError("PLANNING_VALIDATION_FAILED", "At least one field must be supplied.");
  }
}

export function validateScheduleTimes(startAt: string, endAt: string): void {
  if (!startAt || !validDateTime(startAt)) {
    throw new PlanningError("SCHEDULE_INVALID_START_TIME", "Start time must be a valid datetime.");
  }
  if (!endAt || !validDateTime(endAt)) {
    throw new PlanningError("SCHEDULE_INVALID_END_TIME", "End time must be a valid datetime.");
  }
  if (Date.parse(endAt) <= Date.parse(startAt)) {
    throw new PlanningError("SCHEDULE_INVALID_TIME_RANGE", "End time must be after start time.");
  }
}

export function validateCreateScheduleInput(input: CreateScheduleInput): void {
  if (!input.actionId?.trim()) {
    throw new PlanningError("SCHEDULE_ACTION_NOT_FOUND", "Action ID is required.");
  }
  validateScheduleTimes(input.startAt, input.endAt);
}

export function validateUpdateScheduleInput(input: UpdateScheduleInput): void {
  if (Object.keys(input).length === 0) {
    throw new PlanningError("PLANNING_VALIDATION_FAILED", "At least one field must be supplied.");
  }
  if (input.startAt !== undefined && !validDateTime(input.startAt)) {
    throw new PlanningError("SCHEDULE_INVALID_START_TIME", "Start time must be a valid datetime.");
  }
  if (input.endAt !== undefined && !validDateTime(input.endAt)) {
    throw new PlanningError("SCHEDULE_INVALID_END_TIME", "End time must be a valid datetime.");
  }
}

export function validateDateRange(range: PlanningDateRange): void {
  if (!validDate(range.startDate) || !validDate(range.endDate)) {
    throw new PlanningError("SCHEDULE_INVALID_DATE_RANGE", "Date range must contain valid dates.");
  }
  if (range.endDate < range.startDate) {
    throw new PlanningError("SCHEDULE_INVALID_DATE_RANGE", "End date cannot be before start date.");
  }
}
