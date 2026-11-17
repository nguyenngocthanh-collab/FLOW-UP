import type {
  CreateMilestoneInput,
  UpdateMilestoneInput
} from "./milestone.types";

const MAX_TITLE_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 5000;

export interface MilestoneValidationResult {
  valid: boolean;
  code?: "MILESTONE_INVALID_TITLE" | "MILESTONE_INVALID_INPUT";
}

function validOptionalText(value: unknown, maxLength: number): boolean {
  return value === undefined || value === null ||
    (typeof value === "string" && value.length <= maxLength);
}

function validDate(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === "string" &&
    value.trim().length > 0 &&
    !Number.isNaN(Date.parse(value));
}

export function validateCreateMilestoneInput(
  input: CreateMilestoneInput
): MilestoneValidationResult {
  if (
    typeof input.title !== "string" ||
    input.title.trim().length === 0 ||
    input.title.trim().length > MAX_TITLE_LENGTH
  ) {
    return { valid: false, code: "MILESTONE_INVALID_TITLE" };
  }

  if (
    typeof input.goalId !== "string" ||
    input.goalId.trim().length === 0 ||
    !validOptionalText(input.description, MAX_DESCRIPTION_LENGTH) ||
    !validDate(input.targetDate)
  ) {
    return { valid: false, code: "MILESTONE_INVALID_INPUT" };
  }

  return { valid: true };
}

export function validateUpdateMilestoneInput(
  input: UpdateMilestoneInput
): MilestoneValidationResult {
  if (Object.keys(input).length === 0) {
    return { valid: false, code: "MILESTONE_INVALID_INPUT" };
  }

  if (
    input.title !== undefined &&
    (typeof input.title !== "string" ||
      input.title.trim().length === 0 ||
      input.title.trim().length > MAX_TITLE_LENGTH)
  ) {
    return { valid: false, code: "MILESTONE_INVALID_TITLE" };
  }

  if (
    !validOptionalText(input.description, MAX_DESCRIPTION_LENGTH) ||
    !validDate(input.targetDate)
  ) {
    return { valid: false, code: "MILESTONE_INVALID_INPUT" };
  }

  return { valid: true };
}
