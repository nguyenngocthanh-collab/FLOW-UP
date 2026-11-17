export type ReviewErrorCode =
  | "REVIEW_NOT_FOUND" | "REVIEW_ACCESS_DENIED" | "REVIEW_INVALID_SCOPE"
  | "REVIEW_INVALID_DATE_RANGE" | "REVIEW_GOAL_NOT_FOUND"
  | "REVIEW_SOURCE_DATA_UNAVAILABLE" | "REVIEW_PARTIAL_DATA"
  | "REVIEW_COMPARISON_FAILED" | "REVIEW_PROGRESS_HISTORY_UNAVAILABLE"
  | "REVIEW_SUMMARY_GENERATION_FAILED" | "REVIEW_NOTE_INVALID"
  | "REVIEW_NOTE_EMPTY" | "REVIEW_INVALID_STATE"
  | "REVIEW_PERSISTENCE_ERROR" | "REVIEW_DEPENDENCY_UNAVAILABLE";
export class ReviewError extends Error {
  constructor(public readonly code: ReviewErrorCode, message: string, public readonly cause?: unknown) {
    super(message); this.name = "ReviewError";
  }
}
