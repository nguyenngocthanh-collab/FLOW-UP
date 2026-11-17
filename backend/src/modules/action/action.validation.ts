import type {
  CreateActionInput,
  RecordExecutionInput,
  UpdateActionInput
} from "./action.types";

const MAX_TITLE_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_NOTE_LENGTH = 5000;

function validDate(value: unknown): boolean {
  return value === undefined || value === null ||
    (typeof value === "string" &&
      value.trim().length > 0 &&
      !Number.isNaN(Date.parse(value)));
}

export function validateCreateActionInput(input: CreateActionInput) {
  if (
    typeof input.title !== "string" ||
    input.title.trim().length === 0 ||
    input.title.trim().length > MAX_TITLE_LENGTH
  ) return { valid: false as const, code: "ACTION_INVALID_TITLE" as const };

  if (
    typeof input.goalId !== "string" ||
    input.goalId.trim().length === 0 ||
    (input.milestoneId !== undefined && input.milestoneId !== null &&
      (typeof input.milestoneId !== "string" || !input.milestoneId.trim())) ||
    (input.description !== undefined && input.description !== null &&
      (typeof input.description !== "string" ||
        input.description.length > MAX_DESCRIPTION_LENGTH))
  ) return { valid: false as const, code: "ACTION_INVALID_INPUT" as const };

  return { valid: true as const };
}

export function validateUpdateActionInput(input: UpdateActionInput) {
  if (Object.keys(input).length === 0) {
    return { valid: false as const, code: "ACTION_INVALID_INPUT" as const };
  }
  if (input.title !== undefined &&
    (typeof input.title !== "string" ||
      !input.title.trim() ||
      input.title.trim().length > MAX_TITLE_LENGTH)) {
    return { valid: false as const, code: "ACTION_INVALID_TITLE" as const };
  }
  if (input.description !== undefined && input.description !== null &&
    (typeof input.description !== "string" ||
      input.description.length > MAX_DESCRIPTION_LENGTH)) {
    return { valid: false as const, code: "ACTION_INVALID_INPUT" as const };
  }
  return { valid: true as const };
}

export function validateExecutionInput(input: RecordExecutionInput) {
  if (
    !validDate(input.actualStartedAt) ||
    !validDate(input.actualCompletedAt) ||
    (input.actualDurationMinutes !== undefined &&
      input.actualDurationMinutes !== null &&
      (!Number.isFinite(input.actualDurationMinutes) ||
        input.actualDurationMinutes < 0)) ||
    (input.executionNote !== undefined && input.executionNote !== null &&
      (typeof input.executionNote !== "string" ||
        input.executionNote.length > MAX_NOTE_LENGTH))
  ) return { valid: false as const, code: "ACTION_INVALID_EXECUTION_DATA" as const };

  if (
    input.actualStartedAt &&
    input.actualCompletedAt &&
    Date.parse(input.actualCompletedAt) < Date.parse(input.actualStartedAt)
  ) return { valid: false as const, code: "ACTION_INVALID_TIME_RANGE" as const };

  if (Object.keys(input).length === 0) {
    return { valid: false as const, code: "ACTION_INVALID_EXECUTION_DATA" as const };
  }
  return { valid: true as const };
}
