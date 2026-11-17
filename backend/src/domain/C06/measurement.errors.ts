export type MeasurementErrorCode =
  | "MEASUREMENT_NOT_FOUND"
  | "MEASUREMENT_ACCESS_DENIED"
  | "MEASUREMENT_INVALID_ID"
  | "MEASUREMENT_INVALID_NAME"
  | "MEASUREMENT_INVALID_DESCRIPTION"
  | "MEASUREMENT_GOAL_REQUIRED"
  | "MEASUREMENT_GOAL_NOT_FOUND"
  | "MEASUREMENT_GOAL_INVALID"
  | "MEASUREMENT_OWNERSHIP_INVALID"
  | "MEASUREMENT_SCOPE_INVALID"
  | "MEASUREMENT_VALUE_TYPE_REQUIRED"
  | "MEASUREMENT_VALUE_TYPE_UNSUPPORTED"
  | "MEASUREMENT_VALUE_INVALID"
  | "MEASUREMENT_UNIT_INVALID"
  | "MEASUREMENT_UNIT_INCOMPATIBLE"
  | "MEASUREMENT_PRECISION_INVALID"
  | "MEASUREMENT_BASELINE_INVALID"
  | "MEASUREMENT_TARGET_INVALID"
  | "MEASUREMENT_TARGET_DIRECTION_INVALID"
  | "MEASUREMENT_RECORD_NOT_FOUND"
  | "MEASUREMENT_RECORD_INVALID"
  | "MEASUREMENT_RECORD_OWNERSHIP_INVALID"
  | "MEASUREMENT_TIMESTAMP_INVALID"
  | "MEASUREMENT_VALIDATION_FAILED";

export interface MeasurementError {
  code: MeasurementErrorCode;
  message: string;
  field?: string;
}

export type MeasurementResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: MeasurementError };

export function measurementError(
  code: MeasurementErrorCode,
  message: string,
  field?: string,
): MeasurementError {
  return field ? { code, message, field } : { code, message };
}
