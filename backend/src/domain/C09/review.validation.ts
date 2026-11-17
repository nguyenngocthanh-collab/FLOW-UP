import {
  Review, ReviewPeriod, ReviewScopeFacts, ReviewSourceStatus, ReviewUserFacts,
} from "./review.types";
import { ReviewError, ReviewErrorCode, reviewError } from "./review.errors";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: ReviewError };

const ok: ValidationResult = { valid: true };
function fail(code: ReviewErrorCode, message: string, field?: string): ValidationResult {
  return { valid: false, error: reviewError(code, message, field) };
}

function validTimestamp(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Date.parse(value));
}

export function validateReviewPeriod(period: ReviewPeriod): ValidationResult {
  if (!period || !validTimestamp(period.start) || !validTimestamp(period.end)) {
    return fail("REVIEW_PERIOD_INVALID", "Review period start and end must be valid timestamps.");
  }
  if (Date.parse(period.end) < Date.parse(period.start)) {
    return fail("REVIEW_PERIOD_RANGE_INVALID", "Review period end must not be before start.");
  }
  return ok;
}

export function validateReviewScope(
  scope: Review["scope"],
  facts: ReviewScopeFacts,
): ValidationResult {
  if (!scope || !scope.type?.trim()) return fail("REVIEW_SCOPE_REQUIRED", "Review scope is required.");
  if (!scope.id?.trim()) return fail("REVIEW_SCOPE_INVALID", "A scope ID is required for this scope.", "scope.id");
  if (!facts.exists) return fail("REVIEW_SCOPE_NOT_FOUND", "Referenced scope does not exist.");
  if (!facts.accessible) return fail("REVIEW_SCOPE_ACCESS_DENIED", "Referenced scope is not accessible.");
  if (!facts.validForReview) return fail("REVIEW_SCOPE_INVALID", "Referenced scope is not valid for Review.");
  return ok;
}

export function validateReviewOwnership(userId: unknown, facts: ReviewUserFacts): ValidationResult {
  if (typeof userId !== "string" || !userId.trim()) {
    return fail("REVIEW_OWNER_REQUIRED", "Review owner is required.", "userId");
  }
  if (!facts.userExists) return fail("REVIEW_OWNERSHIP_INVALID", "Review owner does not exist.");
  if (!facts.accessible) return fail("REVIEW_ACCESS_DENIED", "Review owner context is not accessible.");
  return ok;
}

export function validateReview(review: Review, userFacts: ReviewUserFacts, scopeFacts: ReviewScopeFacts): ValidationResult {
  if (!review.id) return fail("REVIEW_INVALID_ID", "Review ID is required.", "id");
  const owner = validateReviewOwnership(review.userId, userFacts);
  if (!owner.valid) return owner;
  const scope = validateReviewScope(review.scope, scopeFacts);
  if (!scope.valid) return scope;
  const period = validateReviewPeriod(review.period);
  if (!period.valid) return period;
  if (!validTimestamp(review.createdAt) || !validTimestamp(review.updatedAt)) {
    return fail("REVIEW_VALIDATION_FAILED", "Review timestamps must be valid.");
  }
  return ok;
}

/** Preserve source availability categories; no absent source is converted to zero. */
export function validateReviewSourceStatuses(statuses: readonly ReviewSourceStatus[]): ValidationResult {
  for (const status of statuses) {
    if (!status.source?.trim()) return fail("REVIEW_SOURCE_INVALID", "Source identifier is required.");
    if (!["AVAILABLE", "PARTIALLY_AVAILABLE", "MISSING", "NOT_APPLICABLE", "INVALID"].includes(status.availability)) {
      return fail("REVIEW_SOURCE_INVALID", "Unknown source availability state.", status.source);
    }
  }
  return ok;
}

export function validateReviewNote(note: {
  id: string; reviewId: string; content: string; createdAt: string; updatedAt: string;
}, owningReviewId: string): ValidationResult {
  if (!note.id || !note.reviewId || typeof note.content !== "string" || !note.content.trim()) {
    return fail("REVIEW_NOTE_INVALID", "Note ID, Review ID and non-empty content are required.");
  }
  if (note.reviewId !== owningReviewId) {
    return fail("REVIEW_NOTE_ACCESS_DENIED", "Note does not belong to the resolved Review.");
  }
  if (!validTimestamp(note.createdAt) || !validTimestamp(note.updatedAt)) {
    return fail("REVIEW_NOTE_INVALID", "Note timestamps must be valid.");
  }
  return ok;
}

/** C09 consumes authoritative Progress; it must not calculate or approximate it. */
export function requireAuthoritativeProgressSource(sourceModule: string): ValidationResult {
  return sourceModule === "C08"
    ? ok
    : fail("REVIEW_PROGRESS_SOURCE_INVALID", "Progress shown in Review must come from C08.");
}
