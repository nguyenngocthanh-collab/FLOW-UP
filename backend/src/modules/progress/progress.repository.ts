import type {
  ActionCompletionResult, AuthenticatedUserContext, GoalId, GoalProgressResult,
  MeasurementProgressResult, ProgressSummary,
} from "./progress.types";

export interface ProgressSourceAccess {
  assertCanAccessGoal(user: AuthenticatedUserContext, goalId: GoalId): Promise<void>;
  getMeasurementProgressInputs(user: AuthenticatedUserContext, goalId: GoalId): Promise<unknown[]>;
  getActionProgressInput(user: AuthenticatedUserContext, goalId: GoalId): Promise<unknown>;
  getChildGoalIds(user: AuthenticatedUserContext, goalId: GoalId): Promise<GoalId[]>;
  getGoalProgressInputs(user: AuthenticatedUserContext, goalId: GoalId): Promise<{
    measurementResults: MeasurementProgressResult[];
    actionResult: ActionCompletionResult | null;
    childGoalResults: GoalProgressResult[];
  }>;
}

export interface ProgressRules {
  calculateMeasurement(input: unknown): MeasurementProgressResult;
  calculateActionCompletion(input: unknown): ActionCompletionResult;
  calculateGoal(input: unknown): GoalProgressResult;
  aggregateChildGoals(input: unknown): GoalProgressResult;
  compareMeasurement(input: unknown): {
    difference: unknown | null; comparisonStatus: string; progressValue: number | null;
  };
  combineStatuses(statuses: string[]): "CALCULATED" | "NOT_APPLICABLE" | "INSUFFICIENT_DATA" | "RULE_NOT_CONFIGURED";
}

export interface ProgressHistoryRepository {
  /** Optional persistence contract. Do not use until C08/C09 approves snapshots/history. */
  saveSnapshot?(userId: string, goalId: GoalId, summary: ProgressSummary): Promise<void>;
}
