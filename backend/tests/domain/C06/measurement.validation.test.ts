import { describe, expect, it } from "vitest";
import {
  validateMeasurementName, validateMeasurementGoal, validateMeasurementValue,
  validateMeasurementRecord,
} from "../../../src/domain/C06";

describe("C06 Measurement validation", () => {
  it("rejects blank names", () => {
    expect(validateMeasurementName("  ").valid).toBe(false);
  });

  it("requires an existing, accessible, valid Goal", () => {
    expect(validateMeasurementGoal("goal-1", {
      exists: true, accessible: true, validForMeasurement: true,
    }).valid).toBe(true);
    expect(validateMeasurementGoal("goal-1", {
      exists: false, accessible: true, validForMeasurement: true,
    })).toMatchObject({ valid: false, error: { code: "MEASUREMENT_GOAL_NOT_FOUND" } });
  });

  it("does not assume an official value type policy", () => {
    expect(validateMeasurementValue("numeric", 12)).toMatchObject({
      valid: false, error: { code: "MEASUREMENT_VALUE_TYPE_UNSUPPORTED" },
    });
  });

  it("keeps a record tied to its owning Measurement", () => {
    const result = validateMeasurementRecord({
      id: "record-1" as never, measurementId: "measurement-1" as never,
      value: 4, recordedAt: "2026-01-01T10:00:00Z", createdAt: "2026-01-01T10:01:00Z",
    }, { measurementExists: true, measurementAccessible: true, measurementId: "measurement-2" });
    expect(result).toMatchObject({ valid: false, error: { code: "MEASUREMENT_RECORD_OWNERSHIP_INVALID" } });
  });
});
