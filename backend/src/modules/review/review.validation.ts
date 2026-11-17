import { ReviewError } from "./review.errors";
import type { ReviewScope, UpdateReviewNoteInput } from "./review.types";
export type ReviewValidationRules = { maxNoteLength: number; requireGoalId: boolean; allowPeriodOnlyScope: boolean };
export function validateReviewScope(scope: ReviewScope, rules: ReviewValidationRules): void {
  const goal = Boolean(scope.goalId?.trim()), period = Boolean(scope.periodStart || scope.periodEnd), daily = Boolean(scope.dailyPlanId?.trim());
  if (!goal && !period && !daily) throw new ReviewError("REVIEW_INVALID_SCOPE", "A review scope is required.");
  if (rules.requireGoalId && !goal) throw new ReviewError("REVIEW_INVALID_SCOPE", "A Goal ID is required.");
  if (!rules.allowPeriodOnlyScope && period && !goal && !daily) throw new ReviewError("REVIEW_INVALID_SCOPE", "Period-only scope is disabled.");
  if (scope.periodStart && Number.isNaN(Date.parse(scope.periodStart))) throw new ReviewError("REVIEW_INVALID_DATE_RANGE", "Invalid periodStart.");
  if (scope.periodEnd && Number.isNaN(Date.parse(scope.periodEnd))) throw new ReviewError("REVIEW_INVALID_DATE_RANGE", "Invalid periodEnd.");
  if (scope.periodStart && scope.periodEnd && Date.parse(scope.periodStart) > Date.parse(scope.periodEnd))
    throw new ReviewError("REVIEW_INVALID_DATE_RANGE", "periodStart must not be after periodEnd.");
}
export function validateReviewNote(input: UpdateReviewNoteInput, rules: ReviewValidationRules): string {
  if (typeof input.content !== "string") throw new ReviewError("REVIEW_NOTE_INVALID", "Note content must be a string.");
  const content = input.content.trim();
  if (!content) throw new ReviewError("REVIEW_NOTE_EMPTY", "Review note cannot be empty.");
  if (content.length > rules.maxNoteLength) throw new ReviewError("REVIEW_NOTE_INVALID", "Review note exceeds configured length.");
  return content;
}
