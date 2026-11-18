import { MeasurementError } from "./measurement.errors";
import type {
  CreateMeasurementInput,
  MeasurementHistoryQuery,
  RecordMeasurementValueInput,
  UpdateMeasurementInput,
} from "./measurement.types";

export function validateCreateMeasurementInput(input: CreateMeasurementInput): void {
  if (typeof input.goalId !== "string" || !input.goalId.trim()) throw new MeasurementError("MEASUREMENT_GOAL_NOT_FOUND", "Goal ID is required.");
  if (typeof input.label !== "string" || !input.label.trim()) throw new MeasurementError("MEASUREMENT_INVALID_LABEL", "Label is required.");
  if (typeof input.valueType !== "string" || !input.valueType.trim()) throw new MeasurementError("MEASUREMENT_INVALID_VALUE_TYPE", "Value type is required.");
  if (input.label.trim().length > 120) throw new MeasurementError("MEASUREMENT_INVALID_LABEL", "Label must be 120 characters or fewer.");
  if (input.description != null && (typeof input.description !== "string" || input.description.length > 2000)) {
    throw new MeasurementError("MEASUREMENT_INVALID_LABEL", "Description must be text up to 2,000 characters.");
  }
  if (input.unit != null && (typeof input.unit !== "string" || !input.unit.trim() || input.unit.length > 40)) {
    throw new MeasurementError("MEASUREMENT_INVALID_UNIT", "Unit must be omitted, null, or non-empty text.");
  }
}

export function validateUpdateMeasurementInput(input: UpdateMeasurementInput): void {
  if (Object.keys(input).length === 0) {
    throw new MeasurementError("MEASUREMENT_INVALID_UPDATE", "At least one field must be supplied.");
  }
  if (input.label !== undefined && (typeof input.label !== "string" || !input.label.trim())) {
    throw new MeasurementError("MEASUREMENT_INVALID_LABEL", "Label cannot be empty.");
  }
  if (input.label !== undefined && input.label.trim().length > 120) {
    throw new MeasurementError("MEASUREMENT_INVALID_LABEL", "Label must be 120 characters or fewer.");
  }
  if (input.unit !== undefined && input.unit !== null &&
      (typeof input.unit !== "string" || !input.unit.trim() || input.unit.length > 40)) {
    throw new MeasurementError("MEASUREMENT_INVALID_UNIT", "Unit must be null or non-empty text.");
  }
  if (input.description !== undefined && input.description !== null &&
      (typeof input.description !== "string" || input.description.length > 2000)) {
    throw new MeasurementError("MEASUREMENT_INVALID_UPDATE", "Description must be text up to 2,000 characters.");
  }
}

export function validateRecordInput(input: RecordMeasurementValueInput): void {
  if (!input.measurementId?.trim()) {
    throw new MeasurementError("MEASUREMENT_NOT_FOUND", "Measurement ID is required.");
  }
  if (input.value === undefined || input.value === null ||
      !["number", "string", "boolean"].includes(typeof input.value) ||
      (typeof input.value === "number" && !Number.isFinite(input.value))) {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Value must be a finite number, string, or boolean.");
  }
  if (input.recordedAt !== undefined && Number.isNaN(Date.parse(input.recordedAt))) {
    throw new MeasurementError("MEASUREMENT_INVALID_TIMESTAMP", "Recorded At must be a valid date.");
  }
  if (input.note != null && typeof input.note !== "string") {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Note must be text.");
  }
  if (input.note != null && input.note.length > 1000) {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Note must be 1,000 characters or fewer.");
  }
  if (typeof input.value === "string" && input.value.length > 2000) {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Text values must be 2,000 characters or fewer.");
  }
}

export function validateHistoryQuery(query: MeasurementHistoryQuery): void {
  if (query.from && Number.isNaN(Date.parse(query.from))) {
    throw new MeasurementError("MEASUREMENT_INVALID_TIMESTAMP", "History start date is invalid.");
  }
  if (query.to && Number.isNaN(Date.parse(query.to))) {
    throw new MeasurementError("MEASUREMENT_INVALID_TIMESTAMP", "History end date is invalid.");
  }
  if (query.from && query.to && Date.parse(query.from) > Date.parse(query.to)) {
    throw new MeasurementError("MEASUREMENT_INVALID_TIMESTAMP", "History date range is invalid.");
  }
  if (query.offset !== undefined && (!Number.isInteger(query.offset) || query.offset < 0)) {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Offset must be a non-negative integer.");
  }
  if (query.limit !== undefined && (!Number.isInteger(query.limit) || query.limit < 1 || query.limit > 200)) {
    throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Limit must be between 1 and 200.");
  }
}
