export type MeasurementErrorCode =
  | "MEASUREMENT_NOT_FOUND"
  | "MEASUREMENT_ACCESS_DENIED"
  | "MEASUREMENT_GOAL_NOT_FOUND"
  | "MEASUREMENT_INVALID_LABEL"
  | "MEASUREMENT_INVALID_VALUE_TYPE"
  | "MEASUREMENT_INVALID_VALUE"
  | "MEASUREMENT_INVALID_UNIT"
  | "MEASUREMENT_INVALID_TARGET"
  | "MEASUREMENT_INVALID_TIMESTAMP"
  | "MEASUREMENT_RECORD_NOT_FOUND"
  | "MEASUREMENT_ARCHIVED"
  | "MEASUREMENT_INVALID_UPDATE"
  | "MEASUREMENT_PERSISTENCE_ERROR";

export class MeasurementError extends Error {
  constructor(
    public readonly code: MeasurementErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "MeasurementError";
  }
}
