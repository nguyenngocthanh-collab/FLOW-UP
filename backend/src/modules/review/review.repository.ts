import type { ReviewRecord, ReviewScope, PlannedWorkItem, ActualExecutionItem, PlannedActualComparison, ReviewSummary } from "./review.types";
import type { ReviewValidationRules } from "./review.validation";
export interface ReviewRepository {
  create(record: ReviewRecord): Promise<ReviewRecord>;
  getById(reviewId: string): Promise<ReviewRecord | null>;
  updateNote(reviewId: string, userId: string, note: string, updatedAt: string): Promise<ReviewRecord | null>;
  updateSummary(reviewId: string, userId: string, summary: ReviewSummary, updatedAt: string): Promise<ReviewRecord | null>;
}
export interface ReviewAccess { assertScopeAccess(userId: string, scope: ReviewScope): Promise<void>; }
export interface ReviewSourceReader {
  getPlannedWork(userId: string, scope: ReviewScope): Promise<{ data: PlannedWorkItem[]; limitations?: string[] }>;
  getActualExecution(userId: string, scope: ReviewScope): Promise<{ data: ActualExecutionItem[]; limitations?: string[] }>;
  getProgress(userId: string, scope: ReviewScope): Promise<{ data: unknown | null; status: "AVAILABLE" | "EMPTY" | "UNAVAILABLE"; limitations?: string[] }>;
  getMeasurement(userId: string, scope: ReviewScope): Promise<{ data: unknown | null; status: "AVAILABLE" | "EMPTY" | "UNAVAILABLE" | "NOT_REQUESTED"; limitations?: string[] }>;
}
export interface ReviewRules {
  validation: ReviewValidationRules;
  matchPlannedToActual(planned: PlannedWorkItem[], actual: ActualExecutionItem[]): PlannedActualComparison;
  generateSummary(input: Omit<ReviewSummary, "limitations">): ReviewSummary;
  now(): string;
  createReviewRecord: boolean;
  persistSummary: boolean;
}
