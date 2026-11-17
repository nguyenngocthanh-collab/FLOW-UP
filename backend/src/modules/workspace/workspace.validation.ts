import type { CreateProjectInput, UpdateProjectInput } from "./workspace.types";

const MAX_PROJECT_NAME_LENGTH = 120;
const MAX_PROJECT_DESCRIPTION_LENGTH = 2000;

export interface WorkspaceValidationResult {
  valid: boolean;
  code?: "PROJECT_INVALID_NAME" | "PROJECT_INVALID_INPUT";
}

export function validateCreateProjectInput(
  input: CreateProjectInput
): WorkspaceValidationResult {
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    return { valid: false, code: "PROJECT_INVALID_NAME" };
  }

  if (input.name.trim().length > MAX_PROJECT_NAME_LENGTH) {
    return { valid: false, code: "PROJECT_INVALID_NAME" };
  }

  if (
    input.description !== undefined &&
    input.description !== null &&
    (typeof input.description !== "string" ||
      input.description.length > MAX_PROJECT_DESCRIPTION_LENGTH)
  ) {
    return { valid: false, code: "PROJECT_INVALID_INPUT" };
  }

  return { valid: true };
}

export function validateUpdateProjectInput(
  input: UpdateProjectInput
): WorkspaceValidationResult {
  if (Object.keys(input).length === 0) {
    return { valid: false, code: "PROJECT_INVALID_INPUT" };
  }

  if (
    input.name !== undefined &&
    (typeof input.name !== "string" ||
      input.name.trim().length === 0 ||
      input.name.trim().length > MAX_PROJECT_NAME_LENGTH)
  ) {
    return { valid: false, code: "PROJECT_INVALID_NAME" };
  }

  if (
    input.description !== undefined &&
    input.description !== null &&
    (typeof input.description !== "string" ||
      input.description.length > MAX_PROJECT_DESCRIPTION_LENGTH)
  ) {
    return { valid: false, code: "PROJECT_INVALID_INPUT" };
  }

  return { valid: true };
}
