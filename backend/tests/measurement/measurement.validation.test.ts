import { describe, expect, it } from "vitest";
import {
  validateCreateMeasurementInput, validateHistoryQuery, validateRecordInput,
  validateUpdateMeasurementInput,
} from "../../src/modules/measurement";

describe("measurement validation", () => {
  it("accepts a basic definition input", () => {
    expect(() => validateCreateMeasurementInput({
      goalId: "goal-1", label: "IELTS Overall", valueType: "NUMBER",
    })).not.toThrow();
  });

  it("rejects an empty label", () => {
    expect(() => validateCreateMeasurementInput({
      goalId: "goal-1", label: " ", valueType: "NUMBER",
    })).toThrow();
  });

  it("rejects non-finite numeric values", () => {
    expect(() => validateRecordInput({ measurementId: "m-1", value: Number.NaN })).toThrow();
  });

  it("rejects invalid date ranges", () => {
    expect(() => validateHistoryQuery({
      from: "2026-11-10", to: "2026-11-01",
    })).toThrow();
  });

  it("rejects empty updates", () => {
    expect(() => validateUpdateMeasurementInput({})).toThrow();
  });
});
