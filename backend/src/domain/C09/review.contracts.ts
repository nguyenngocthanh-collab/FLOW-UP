import { Review, ReviewNote, ReviewPeriod, ReviewScope, ReviewSourceStatus } from "./review.types";

export interface ReviewSourceReader {
  getGoalFacts(scopeId: string): Promise<unknown>;
  getPlanningFacts(period: ReviewPeriod): Promise<unknown>;
  getActionExecutionFacts(period: ReviewPeriod): Promise<unknown>;
  getMeasurementFacts(scope: ReviewScope, period: ReviewPeriod): Promise<unknown>;
  getAuthoritativeProgress(scope: ReviewScope): Promise<unknown>; // C08 only.
}

export interface ReviewReader {
  getReview(id: string): Promise<Review | null>;
  getReviewsByScope(scope: ReviewScope): Promise<readonly Review[]>;
  getReviewsByPeriod(period: ReviewPeriod): Promise<readonly Review[]>;
  getReviewNotes(reviewId: string): Promise<readonly ReviewNote[]>;
}

export interface ReviewCollectedSources {
  statuses: readonly ReviewSourceStatus[];
  plannedFacts?: unknown;
  actualExecutionFacts?: unknown;
  measurementFacts?: unknown;
  authoritativeProgress?: unknown;
}

/** Comparison contract only. Exact variance/comparison formulas remain OPEN. */
export interface PlannedActualComparison {
  planned: unknown;
  actual: unknown;
  availability: ReviewSourceStatus;
}
