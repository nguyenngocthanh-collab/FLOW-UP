export type GoalId = string;
export type ActionId = string;
export type MeasurementId = string;

export interface AuthenticatedUserContext {
  userId: string;
  email: string | null;
  isAuthenticated: true;
  workspaceId?: string;
}

export type CalculationStatus =
  | "CALCULATED"
  | "NOT_APPLICABLE"
  | "INSUFFICIENT_DATA"
  | "RULE_NOT_CONFIGURED";

export interface MeasurementProgressInput {
  measurementId: MeasurementId;
  currentValue: unknown;
  targetValue: unknown | null;
  unit: string | null;
  valueType: string;
  context?: Record<string, unknown>;
}

export interface MeasurementProgressResult {
  measurementId: MeasurementId;
  currentValue: unknown;
  targetValue: unknown | null;
  progressValue: number | null;
  calculationStatus: CalculationStatus;
  calculationContext: Record<string, unknown>;
}

export interface ActionProgressInput {
  goalId: GoalId;
  actions: Array<{ id: ActionId; status: string; archived?: boolean }>;
}

export interface ActionCompletionResult {
  goalId: GoalId;
  totalActions: number | null;
  completedActions: number | null;
  incompleteActions: number | null;
  completionValue: number | null;
  calculationStatus: CalculationStatus;
  calculationContext: Record<string, unknown>;
}

export interface GoalProgressInput {
  goalId: GoalId;
  measurementResults: MeasurementProgressResult[];
  actionResult: ActionCompletionResult | null;
  childGoalResults: GoalProgressResult[];
  context?: Record<string, unknown>;
}

export interface GoalProgressResult {
  goalId: GoalId;
  progressValue: number | null;
  calculationStatus: CalculationStatus;
  contributingSources: string[];
  calculationContext: Record<string, unknown>;
}

export interface ChildGoalAggregationInput {
  parentGoalId: GoalId;
  childGoalResults: GoalProgressResult[];
}

export interface ProgressSummary {
  goalId: GoalId;
  goalProgress: GoalProgressResult;
  measurementProgress: MeasurementProgressResult[];
  actionCompletion: ActionCompletionResult | null;
  childGoalProgress: GoalProgressResult[];
  calculationStatus: CalculationStatus;
}

export interface MeasurementTargetComparison {
  measurementId: MeasurementId;
  currentValue: unknown;
  targetValue: unknown;
  difference: unknown | null;
  comparisonStatus: string;
  progressValue: number | null;
}
