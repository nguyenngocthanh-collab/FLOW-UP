import { MeasurementError } from "./measurement.errors.ts";
import type { MeasurementRules } from "./measurement.repository.ts";
import type { Measurement, MeasurementRecord, MeasurementValue } from "./measurement.types.ts";

const VALUE_TYPES = new Set(["NUMBER", "TEXT", "BOOLEAN"]);
function matchesType(type: string, value: unknown): value is MeasurementValue {
  if (type === "NUMBER") return typeof value === "number" && Number.isFinite(value);
  if (type === "TEXT") return typeof value === "string";
  if (type === "BOOLEAN") return typeof value === "boolean";
  return false;
}

/** Bounded MVP type policy; C06 remains the owner and can version this explicitly later. */
export class MVPMeasurementRules implements MeasurementRules {
  validateDefinition(input: { valueType: string; unit: string | null; targetValue: unknown }): void {
    if (!VALUE_TYPES.has(input.valueType)) {
      throw new MeasurementError("MEASUREMENT_INVALID_VALUE_TYPE", "Choose Number, Text, or Yes/No.");
    }
    if (input.valueType !== "NUMBER" && input.unit !== null) {
      throw new MeasurementError("MEASUREMENT_INVALID_UNIT", "Units are supported for numeric measurements only.");
    }
    if (input.targetValue !== null && !matchesType(input.valueType, input.targetValue)) {
      throw new MeasurementError("MEASUREMENT_INVALID_TARGET", "Target must match the measurement type.");
    }
  }

  validateValue(definition: Measurement, value: unknown): void {
    if (!matchesType(definition.valueType, value)) {
      throw new MeasurementError("MEASUREMENT_INVALID_VALUE", "Value must match the measurement type.");
    }
  }

  assertCanRecord(definition: Measurement): void {
    if (definition.archivedAt) throw new MeasurementError("MEASUREMENT_ARCHIVED", "Archived measurements cannot receive new values.");
  }

  resolveCurrent(records: MeasurementRecord[]): MeasurementRecord | null {
    return records[0] ?? null;
  }

  assertCanUpdate(definition: Measurement, patch: { unit?: string | null; targetValue?: unknown }, hasRecords: boolean): void {
    if (definition.archivedAt) throw new MeasurementError("MEASUREMENT_ARCHIVED", "Archived measurements cannot be edited.");
    if (hasRecords && patch.unit !== undefined && patch.unit !== definition.unit) {
      throw new MeasurementError("MEASUREMENT_INVALID_UPDATE", "Unit cannot change after values have been recorded.");
    }
  }

  assertCanArchive(definition: Measurement): void {
    if (definition.archivedAt) throw new MeasurementError("MEASUREMENT_INVALID_UPDATE", "Measurement is already archived.");
  }
}
