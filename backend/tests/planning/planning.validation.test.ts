import { describe, expect, it } from "vitest";
import {
  validateCreateScheduleInput, validateDailyPlanInput, validateDateRange, validateScheduleTimes,
} from "../../src/modules/planning";

describe("planning validation", () => {
  it("accepts a valid Daily Plan date", () => {
    expect(() => validateDailyPlanInput({ date: "2026-11-18" })).not.toThrow();
  });

  it("rejects an impossible date", () => {
    expect(() => validateDailyPlanInput({ date: "2026-02-30" })).toThrow();
  });

  it("rejects a schedule whose end is not after its start", () => {
    expect(() => validateScheduleTimes("2026-11-18T09:00:00Z", "2026-11-18T08:00:00Z")).toThrow();
  });

  it("rejects invalid date ranges", () => {
    expect(() => validateDateRange({ startDate: "2026-11-20", endDate: "2026-11-18" })).toThrow();
  });

  it("requires an Action ID", () => {
    expect(() => validateCreateScheduleInput({
      actionId: "", startAt: "2026-11-18T08:00:00Z", endAt: "2026-11-18T09:00:00Z",
    })).toThrow();
  });
});
