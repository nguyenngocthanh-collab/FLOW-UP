import { describe, expect, it } from "vitest";
import {
  validateReviewPeriod, validateReviewSourceStatuses, validateReviewNote,
  requireAuthoritativeProgressSource,
} from "../../../src/domain/C09";

describe("C09 Review validation", () => {
  it("requires a valid period range", () => {
    expect(validateReviewPeriod({
      start: "2026-11-01T00:00:00Z", end: "2026-11-30T23:59:59Z",
    }).valid).toBe(true);
    expect(validateReviewPeriod({
      start: "2026-11-30T00:00:00Z", end: "2026-11-01T00:00:00Z",
    })).toMatchObject({ valid: false, error: { code: "REVIEW_PERIOD_RANGE_INVALID" } });
  });

  it("preserves missing and not-applicable source distinctions", () => {
    expect(validateReviewSourceStatuses([
      { source: "C07", availability: "MISSING" },
      { source: "C04", availability: "NOT_APPLICABLE" },
      { source: "C05", availability: "PARTIALLY_AVAILABLE" },
    ]).valid).toBe(true);
  });

  it("requires notes to belong to the resolved Review", () => {
    expect(validateReviewNote({
      id: "n1", reviewId: "r1", content: "Observation",
      createdAt: "2026-11-17T10:00:00Z", updatedAt: "2026-11-17T10:00:00Z",
    }, "r2")).toMatchObject({ valid: false, error: { code: "REVIEW_NOTE_ACCESS_DENIED" } });
  });

  it("accepts authoritative Progress only from C08", () => {
    expect(requireAuthoritativeProgressSource("C08").valid).toBe(true);
    expect(requireAuthoritativeProgressSource("C09")).toMatchObject({ valid: false });
  });
});
