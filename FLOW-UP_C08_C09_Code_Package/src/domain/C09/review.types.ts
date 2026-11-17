export type ReviewId = string & { readonly __brand: "ReviewId" };
export type ReviewNoteId = string & { readonly __brand: "ReviewNoteId" };
export type UserId = string & { readonly __brand: "UserId" };

export type ReviewScopeType = "GOAL" | "PERIOD" | "DAILY_PLAN" | "PROJECT" | (string & {});
export type ReviewSourceAvailability =
  | "AVAILABLE"
  | "PARTIALLY_AVAILABLE"
  | "MISSING"
  | "NOT_APPLICABLE"
  | "INVALID";

export interface ReviewScope {
  type: ReviewScopeType;
  id?: string | null;
}

export interface ReviewPeriod {
  start: string;
  end: string;
  timezone?: string | null; // OPEN: timezone source/semantics.
  periodType?: string | null; // OPEN: daily/weekly/monthly/custom convention.
}

/** Logical model only; scope combinations and lifecycle policy remain OPEN. */
export interface Review {
  id: ReviewId;
  userId: UserId;
  scope: ReviewScope;
  period: ReviewPeriod;
  summary?: ReviewSummary | null;
  findings?: readonly ReviewFinding[];
  status?: string | null; // OPEN: no official lifecycle enum.
  createdAt: string;
  updatedAt: string;
}

export interface ReviewNote {
  id: ReviewNoteId;
  reviewId: ReviewId;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null; // OPEN: deletion policy.
}

export interface ReviewSourceStatus {
  source: string;
  availability: ReviewSourceAvailability;
  references?: readonly string[];
}

export interface ReviewFinding {
  kind: "DATA_DERIVED" | "USER_OBSERVATION" | "AI_SUGGESTION" | (string & {});
  content: string;
  sourceReferences?: readonly string[];
}

export interface ReviewSummary {
  content?: string | null;
  completedWork?: readonly string[];
  incompleteWork?: readonly string[];
  missingData?: readonly string[];
  findings?: readonly ReviewFinding[];
  sourceStatuses?: readonly ReviewSourceStatus[];
}

export interface ReviewUserFacts {
  userExists: boolean;
  accessible: boolean;
}

export interface ReviewScopeFacts {
  exists: boolean;
  accessible: boolean;
  validForReview: boolean;
}
