import type { GoalReference, Milestone } from "./milestone.types";
import type { DomainError } from "./milestone.errors";

export function validateMilestoneTitle(title: unknown): DomainError | null {
  return typeof title === "string" && title.trim().length > 0
    ? null
    : { code: "MILESTONE_INVALID_TITLE", message: "Milestone title must not be blank." };
}

/** Accepts YYYY-MM-DD only; targetDate is a calendar date, not an instant. */
export function validateTargetDate(value: unknown): DomainError | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { code: "MILESTONE_INVALID_TARGET_DATE", message: "Target date must use YYYY-MM-DD." };
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return valid ? null : { code: "MILESTONE_INVALID_TARGET_DATE", message: "Target date is not a valid calendar date." };
}

export function validateGoalReference(goal: GoalReference | null): DomainError | null {
  if (!goal) return { code: "MILESTONE_GOAL_NOT_FOUND", message: "The referenced Goal does not exist." };
  if (!goal.accessible) return { code: "MILESTONE_ACCESS_DENIED", message: "The Goal is not accessible." };
  if (!goal.valid) return { code: "MILESTONE_GOAL_INVALID", message: "The Goal cannot own this Milestone." };
  return null;
}

export function validateMilestonePosition(position: unknown): DomainError | null {
  return typeof position === "number" && Number.isInteger(position) && position >= 0
    ? null
    : { code: "MILESTONE_REORDER_INVALID", message: "Position must be a non-negative integer." };
}

export function validateMilestoneInput(input: {
  title: unknown;
  targetDate?: unknown;
  goal?: GoalReference | null;
}): DomainError | null {
  const titleError = validateMilestoneTitle(input.title);
  if (titleError) return titleError;
  const dateError = validateTargetDate(input.targetDate);
  if (dateError) return dateError;
  if (input.goal !== undefined) return validateGoalReference(input.goal);
  return null;
}

export function validateReorder(milestones: readonly Milestone[], goalId: string, orderedIds: readonly string[]): DomainError | null {
  const current = milestones.filter(item => item.goalId === goalId);
  const expected = new Set(current.map(item => item.id));
  const supplied = new Set(orderedIds);
  if (expected.size !== supplied.size || orderedIds.length !== supplied.size ||
      [...expected].some(id => !supplied.has(id))) {
    return { code: "MILESTONE_REORDER_INVALID", message: "Reorder must contain each Milestone in the same Goal exactly once." };
  }
  return null;
}
