import {
  Measurement,
  MeasurementGoalFacts,
  MeasurementRecord,
  MeasurementRecordFacts,
} from "./measurement.types";
import { MeasurementError, MeasurementErrorCode, measurementError } from "./measurement.errors";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: MeasurementError };

const ok: ValidationResult = { valid: true };

function fail(code: MeasurementErrorCode, message: string, field?: string): ValidationResult {
  return { valid: false, error: measurementError(code, message, field) };
}

function validTimestamp(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

export function validateMeasurementName(name: unknown): ValidationResult {
  if (typeof name !== "string" || name.trim().length === 0) {
    return fail("MEASUREMENT_INVALID_NAME", "Measurement name must not be blank.", "name");
  }
  return ok;
}

export function validateMeasurementMetadata(input: {
  description?: unknown;
  purpose?: unknown;
}): ValidationResult {
  if (input.description != null && typeof input.description !== "string") {
    return fail("MEASUREMENT_INVALID_DESCRIPTION", "Description must be a string.", "description");
  }
  if (input.purpose != null && typeof input.purpose !== "string") {
    return fail("MEASUREMENT_VALIDATION_FAILED", "Purpose must be a string.", "purpose");
  }
  return ok;
}

export function validateMeasurementGoal(
  goalId: unknown,
  facts: MeasurementGoalFacts,
): ValidationResult {
  if (typeof goalId !== "string" || goalId.trim() === "") {
    return fail("MEASUREMENT_GOAL_REQUIRED", "A Goal reference is required.", "goalId");
  }
  if (!facts.exists) return fail("MEASUREMENT_GOAL_NOT_FOUND", "The referenced Goal does not exist.", "goalId");
  if (!facts.accessible) return fail("MEASUREMENT_ACCESS_DENIED", "The Goal is not accessible.");
  if (!facts.validForMeasurement) return fail("MEASUREMENT_GOAL_INVALID", "The Goal cannot own this Measurement.");
  return ok;
}

export function validateMeasurementDefinition(
  measurement: Pick<Measurement, "id" | "goalId" | "name" | "createdAt" | "updatedAt"> &
    Partial<Pick<Measurement, "description" | "purpose">>,
  goalFacts: MeasurementGoalFacts,
): ValidationResult {
  if (typeof measurement.id !== "string" || !measurement.id.trim()) {
    return fail("MEASUREMENT_INVALID_ID", "Measurement ID is required.", "id");
  }
  const goal = validateMeasurementGoal(measurement.goalId, goalFacts);
  if (!goal.valid) return goal;
  const name = validateMeasurementName(measurement.name);
  if (!name.valid) return name;
  const metadata = validateMeasurementMetadata(measurement);
  if (!metadata.valid) return metadata;
  if (!validTimestamp(measurement.createdAt) || !validTimestamp(measurement.updatedAt)) {
    return fail("MEASUREMENT_TIMESTAMP_INVALID", "Creation and update timestamps must be valid.", "createdAt/updatedAt");
  }
  return ok;
}

/**
 * Value validation is delegated to an approved type policy. No permanent type
 * system is assumed while the specification keeps value types OPEN.
 */
export type ApprovedValueValidator = (valueType: string, value: unknown) => boolean;

export function validateMeasurementValue(
  valueType: string | null | undefined,
  value: unknown,
  approvedValidator?: ApprovedValueValidator,
): ValidationResult {
  if (!valueType) return fail("MEASUREMENT_VALUE_TYPE_REQUIRED", "An approved value type is required.", "valueType");
  if (!approvedValidator) {
    return fail("MEASUREMENT_VALUE_TYPE_UNSUPPORTED", "No approved value-type validator is configured.", "valueType");
  }
  if (!approvedValidator(valueType, value)) {
    return fail("MEASUREMENT_VALUE_INVALID", "Value does not match the configured value-type policy.", "value");
  }
  return ok;
}

export function validateMeasurementRecord(
  record: MeasurementRecord,
  facts: MeasurementRecordFacts,
): ValidationResult {
  if (!record.id || !record.measurementId) {
    return fail("MEASUREMENT_RECORD_INVALID", "Record and Measurement IDs are required.");
  }
  if (!facts.measurementExists) {
    return fail("MEASUREMENT_NOT_FOUND", "The owning Measurement does not exist.", "measurementId");
  }
  if (!facts.measurementAccessible) {
    return fail("MEASUREMENT_ACCESS_DENIED", "The owning Measurement is not accessible.");
  }
  if (facts.measurementId !== record.measurementId) {
    return fail("MEASUREMENT_RECORD_OWNERSHIP_INVALID", "Record references a different Measurement.", "measurementId");
  }
  if (!validTimestamp(record.recordedAt) || !validTimestamp(record.createdAt)) {
    return fail("MEASUREMENT_TIMESTAMP_INVALID", "Recorded and created timestamps must be valid.");
  }
  return ok;
}

/** No latest-value selection is implemented: ordering semantics remain OPEN. */
export function compareRecordedAt(
  _a: MeasurementRecord,
  _b: MeasurementRecord,
): never {
  throw new Error("Current-value and history ordering policy is OPEN for C06.");
}
