import { describe, expect, it } from "vitest";
import {
  validateActionProgressInput, validateChildAggregationInput, validateGoalProgressInput,
  validateMeasurementProgressInput,
} from "../../src/modules/progress";

describe("progress validation", () => {
  it("accepts a Measurement input with explicit nullable target and unit", () => {
    expect(() => validateMeasurementProgressInput({
      measurementId: "m-1", currentValue: 6.5, targetValue: 7, unit: "Band Score", valueType: "NUMBER",
    })).not.toThrow();
  });

  it("rejects missing current value", () => {
    expect(() => validateMeasurementProgressInput({
      measurementId: "m-1", currentValue: null, targetValue: 7, unit: null, valueType: "NUMBER",
    })).toThrow();
  });

  it("validates Action collection", () => {
    expect(() => validateActionProgressInput({
      goalId: "g-1", actions: [{ id: "a-1", status: "COMPLETED" }],
    })).not.toThrow();
  });

  it("rejects duplicate child Goal IDs", () => {
    const child = {
      goalId: "child-1", progressValue: null, calculationStatus: "INSUFFICIENT_DATA" as const,
      contributingSources: [], calculationContext: {},
    };
    expect(() => validateChildAggregationInput({
      parentGoalId: "parent-1", childGoalResults: [child, child],
    })).toThrow();
  });

  it("validates Goal progress structure", () => {
    expect(() => validateGoalProgressInput({
      goalId: "g-1", measurementResults: [], actionResult: null, childGoalResults: [],
    })).not.toThrow();
  });
});
