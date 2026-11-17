import { describe, expect, it } from "vitest";
import {
  isCalendarDate, validateScheduleTimeRange, detectScheduleOverlap,
  validateApprovedPlanningProposal,
} from "../../../src/domain/C07";

describe("C07 Planning validation", () => {
  it("accepts real calendar dates and rejects impossible dates", () => {
    expect(isCalendarDate("2026-02-28")).toBe(true);
    expect(isCalendarDate("2026-02-30")).toBe(false);
  });

  it("requires end after start", () => {
    expect(validateScheduleTimeRange(
      "2026-11-17T09:00:00+07:00", "2026-11-17T10:00:00+07:00",
    ).valid).toBe(true);
    expect(validateScheduleTimeRange(
      "2026-11-17T10:00:00+07:00", "2026-11-17T09:00:00+07:00",
    )).toMatchObject({ valid: false, error: { code: "SCHEDULE_TIME_RANGE_INVALID" } });
  });

  it("detects overlap without deciding whether it blocks", () => {
    expect(detectScheduleOverlap(
      { startAt: "2026-11-17T09:00:00Z", endAt: "2026-11-17T10:00:00Z" },
      { startAt: "2026-11-17T09:30:00Z", endAt: "2026-11-17T10:30:00Z" },
    )).toBe(true);
  });

  it("rejects an unapproved AI proposal", () => {
    expect(validateApprovedPlanningProposal({ approved: false, schedules: [{}] }))
      .toMatchObject({ valid: false, error: { code: "PLANNING_PROPOSAL_NOT_APPROVED" } });
  });
});
