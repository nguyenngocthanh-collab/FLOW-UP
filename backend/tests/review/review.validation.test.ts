import { describe, expect, it } from "vitest";
import { validateReviewNote, validateReviewScope } from "../../src/modules/review/review.validation";
const rules = { maxNoteLength: 500, requireGoalId: false, allowPeriodOnlyScope: true };
describe("Review validation", () => {
  it("accepts Goal scope", () => expect(() => validateReviewScope({ goalId: "g1" }, rules)).not.toThrow());
  it("rejects empty scope", () => expect(() => validateReviewScope({}, rules)).toThrow());
  it("rejects reversed period", () => expect(() => validateReviewScope({ periodStart: "2026-02-02", periodEnd: "2026-01-01" }, rules)).toThrow());
  it("trims note", () => expect(validateReviewNote({ content: "  note " }, rules)).toBe("note"));
  it("rejects empty note", () => expect(() => validateReviewNote({ content: " " }, rules)).toThrow());
});
