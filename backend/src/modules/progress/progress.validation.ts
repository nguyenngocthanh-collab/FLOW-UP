import { ProgressError } from "./progress.errors";
import type {
  ActionProgressInput, ChildGoalAggregationInput, GoalProgressInput, MeasurementProgressInput,
} from "./progress.types";

export function validateMeasurementProgressInput(input: MeasurementProgressInput): void {
  if (!input.measurementId?.trim() || !input.valueType?.trim()) {
    throw new ProgressError("PROGRESS_INVALID_INPUT", "Measurement ID and value type are required.");
  }
  if (input.currentValue === undefined || input.currentValue === null) {
    throw new ProgressError("PROGRESS_INSUFFICIENT_DATA", "Current Measurement Value is unavailable.");
  }
  if (input.targetValue === undefined) {
    throw new ProgressError("PROGRESS_INVALID_TARGET", "Target Value must be supplied explicitly, or null.");
  }
  if (!input.unit && input.unit !== null) {
    throw new ProgressError("PROGRESS_INVALID_UNIT", "Unit must be supplied explicitly, or null.");
  }
}

export function validateActionProgressInput(input: ActionProgressInput): void {
  if (!input.goalId?.trim() || !Array.isArray(input.actions)) {
    throw new ProgressError("PROGRESS_INVALID_INPUT", "Goal ID and Action collection are required.");
  }
  for (const action of input.actions) {
    if (!action.id?.trim() || !action.status?.trim()) {
      throw new ProgressError("PROGRESS_INVALID_INPUT", "Every Action requires an ID and status.");
    }
  }
}

export function validateGoalProgressInput(input: GoalProgressInput): void {
  if (!input.goalId?.trim() || !Array.isArray(input.measurementResults) ||
      !Array.isArray(input.childGoalResults)) {
    throw new ProgressError("PROGRESS_INVALID_INPUT", "Goal progress input is invalid.");
  }
}

export function validateChildAggregationInput(input: ChildGoalAggregationInput): void {
  if (!input.parentGoalId?.trim() || !Array.isArray(input.childGoalResults)) {
    throw new ProgressError("PROGRESS_INVALID_INPUT", "Parent Goal and child results are required.");
  }
  const seen = new Set<string>();
  for (const result of input.childGoalResults) {
    if (!result.goalId?.trim() || seen.has(result.goalId)) {
      throw new ProgressError("PROGRESS_INVALID_HIERARCHY", "Child Goal IDs must be present and unique.");
    }
    seen.add(result.goalId);
  }
}
