export type ProgressErrorCode =
  | "PROGRESS_SCOPE_INVALID"
  | "PROGRESS_SCOPE_NOT_FOUND"
  | "PROGRESS_SOURCE_MISSING"
  | "PROGRESS_SOURCE_INVALID"
  | "PROGRESS_SOURCE_INCOMPATIBLE"
  | "PROGRESS_MEASUREMENT_INVALID"
  | "PROGRESS_MEASUREMENT_TYPE_UNSUPPORTED"
  | "PROGRESS_BASELINE_INVALID"
  | "PROGRESS_TARGET_INVALID"
  | "PROGRESS_ACTION_ELIGIBILITY_INVALID"
  | "PROGRESS_ACTION_SET_EMPTY"
  | "PROGRESS_HIERARCHY_INVALID"
  | "PROGRESS_HIERARCHY_CYCLE"
  | "PROGRESS_WEIGHT_INVALID"
  | "PROGRESS_WEIGHT_NORMALIZATION_FAILED"
  | "PROGRESS_AGGREGATION_INVALID"
  | "PROGRESS_RESULT_UNAVAILABLE"
  | "PROGRESS_RESULT_OUT_OF_RANGE"
  | "PROGRESS_PRECISION_INVALID"
  | "PROGRESS_HISTORY_NOT_FOUND"
  | "PROGRESS_RECALCULATION_FAILED"
  | "PROGRESS_RULE_UNAVAILABLE"
  | "PROGRESS_VALIDATION_FAILED";

export interface ProgressError {
  code: ProgressErrorCode;
  message: string;
  source?: string;
}

export type ProgressResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: ProgressError };

export function progressError(code: ProgressErrorCode, message: string, source?: string): ProgressError {
  return source ? { code, message, source } : { code, message };
}
