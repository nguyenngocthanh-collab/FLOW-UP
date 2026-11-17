import type { CreateGoalInput, UpdateGoalInput } from "./goal.types";

const MAX_TITLE_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 5000;

export interface GoalValidationResult {
  valid: boolean;
  code?: "GOAL_INVALID_TITLE" | "GOAL_INVALID_INPUT";
}

function validOptionalText(value: unknown, maxLength: number): boolean {
  return value === undefined || value === null ||
    (typeof value === "string" && value.length <= maxLength);
}

function validDate(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value !== "string" || value.trim() === "") return false;
  return !Number.isNaN(Date.parse(value));
}

export function validateCreateGoalInput(
  input: CreateGoalInput
): GoalValidationResult {
  if (
    typeof input.title !== "string" ||
    input.title.trim().length === 0 ||
    input.title.trim().length > MAX_TITLE_LENGTH
  ) {
    return { valid: false, code: "GOAL_INVALID_TITLE" };
  }

  if (
    !validOptionalText(input.description, MAX_DESCRIPTION_LENGTH) ||
    !validDate(input.targetDate) ||
    (input.projectId !== undefined && input.projectId !== null &&
      (typeof input.projectId !== "string" || !input.projectId.trim())) ||
    (input.parentGoalId !== undefined && input.parentGoalId !== null &&
      (typeof input.parentGoalId !== "string" || !input.parentGoalId.trim()))
  ) {
    return { valid: false, code: "GOAL_INVALID_INPUT" };
  }

  return { valid: true };
}

export function validateUpdateGoalInput(
  input: UpdateGoalInput
): GoalValidationResult {
  if (Object.keys(input).length === 0) {
    return { valid: false, code: "GOAL_INVALID_INPUT" };
  }

  if (
    input.title !== undefined &&
    (typeof input.title !== "string" ||
      input.title.trim().length === 0 ||
      input.title.trim().length > MAX_TITLE_LENGTH)
  ) {
    return { valid: false, code: "GOAL_INVALID_TITLE" };
  }

  if (
    !validOptionalText(input.description, MAX_DESCRIPTION_LENGTH) ||
    !validDate(input.targetDate)
  ) {
    return { valid: false, code: "GOAL_INVALID_INPUT" };
  }

  return { valid: true };
}
