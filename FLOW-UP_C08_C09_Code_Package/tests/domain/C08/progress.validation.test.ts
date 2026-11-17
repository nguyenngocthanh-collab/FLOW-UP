import { describe, expect, it } from "vitest";
import {
  resolveProgressAvailability, validateProgressResult, requireApprovedCalculationRule,
} from "../../../src/domain/C08";

describe("C08 Progress contracts", () => {
  it("distinguishes unavailable source states", () => {
    expect(resolveProgressAvailability({ applicable: false, available: false, valid: true, references: [] })).toBe("NOT_APPLICABLE");
    expect(resolveProgressAvailability({ applicable: true, available: false, valid: true, references: [] })).toBe("INSUFFICIENT_DATA");
    expect(resolveProgressAvailability({ applicable: true, available: true, valid: false, references: [] })).toBe("INVALID_SOURCE");
    expect(resolveProgressAvailability({ applicable: true, available: true, valid: true, references: [] })).toBe("AVAILABLE");
  });

  it("does not allow unavailable result to carry a numeric zero", () => {
    expect(validateProgressResult({
      scopeType: "GOAL", scopeId: "g1", metricType: "GOAL_PROGRESS",
      value: 0, availability: "INSUFFICIENT_DATA",
      calculatedAt: "2026-11-17T10:00:00Z", sourceReferences: [],
    })).toMatchObject({ valid: false });
  });

  it("blocks calculations without an approved rule", () => {
    expect(requireApprovedCalculationRule(false))
      .toMatchObject({ valid: false, error: { code: "PROGRESS_RULE_UNAVAILABLE" } });
  });
});
