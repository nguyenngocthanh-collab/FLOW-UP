import { ProgressCalculationResult, ProgressSourceReference } from "./progress.types";

export interface GoalProgressSourceReader {
  getGoalFacts(goalId: string): Promise<unknown>;
}

export interface ActionProgressSourceReader {
  getActionProgressFacts(goalId: string): Promise<unknown>;
}

export interface MeasurementProgressSourceReader {
  getMeasurementProgressFacts(goalId: string): Promise<unknown>;
}

export interface ProgressHistoryReader {
  getProgressHistory(scopeType: string, scopeId: string): Promise<readonly ProgressCalculationResult[]>;
}

/** Read contract for C09 and application consumers; C08 remains sole authority. */
export interface AuthoritativeProgressReader {
  getProgress(scopeType: string, scopeId: string, metricType: string): Promise<ProgressCalculationResult | null>;
}

export interface ProgressSourceSnapshot {
  references: readonly ProgressSourceReference[];
  capturedAt: string;
}
