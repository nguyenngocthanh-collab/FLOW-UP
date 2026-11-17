import { ProgressError } from "./progress.errors";
import type { ProgressRules, ProgressSourceAccess, ProgressHistoryRepository } from "./progress.repository";
import type {
  ActionCompletionResult, ActionProgressInput, AuthenticatedUserContext, ChildGoalAggregationInput,
  GoalProgressInput, GoalProgressResult, MeasurementProgressInput, MeasurementProgressResult,
  MeasurementTargetComparison, ProgressSummary,
} from "./progress.types";
import {
  validateActionProgressInput, validateChildAggregationInput, validateGoalProgressInput,
  validateMeasurementProgressInput,
} from "./progress.validation";

export class ProgressService {
  constructor(
    private readonly sources: ProgressSourceAccess,
    private readonly rules: ProgressRules,
    private readonly history?: ProgressHistoryRepository,
  ) {}

  calculateMeasurementProgress(
    user: AuthenticatedUserContext, input: MeasurementProgressInput,
  ): MeasurementProgressResult {
    this.assertAuthenticated(user);
    validateMeasurementProgressInput(input);
    return this.rules.calculateMeasurement(input);
  }

  calculateActionCompletion(
    user: AuthenticatedUserContext, input: ActionProgressInput,
  ): ActionCompletionResult {
    this.assertAuthenticated(user);
    validateActionProgressInput(input);
    return this.rules.calculateActionCompletion(input);
  }

  calculateGoalProgress(user: AuthenticatedUserContext, input: GoalProgressInput): GoalProgressResult {
    this.assertAuthenticated(user);
    validateGoalProgressInput(input);
    return this.rules.calculateGoal(input);
  }

  aggregateChildGoalProgress(
    user: AuthenticatedUserContext, input: ChildGoalAggregationInput,
  ): GoalProgressResult {
    this.assertAuthenticated(user);
    validateChildAggregationInput(input);
    return this.rules.aggregateChildGoals(input);
  }

  compareMeasurementWithTarget(
    user: AuthenticatedUserContext, input: MeasurementProgressInput,
  ): MeasurementTargetComparison {
    this.assertAuthenticated(user);
    validateMeasurementProgressInput(input);
    if (input.targetValue === null) {
      throw new ProgressError("PROGRESS_INSUFFICIENT_DATA", "Measurement has no Target Value.");
    }
    const comparison = this.rules.compareMeasurement(input);
    return {
      measurementId: input.measurementId,
      currentValue: input.currentValue,
      targetValue: input.targetValue,
      ...comparison,
    };
  }

  async getGoalProgressSummary(user: AuthenticatedUserContext, goalId: string): Promise<ProgressSummary> {
    this.assertAuthenticated(user);
    await this.sources.assertCanAccessGoal(user, goalId);
    const inputs = await this.sources.getGoalProgressInputs(user, goalId);
    const goalInput: GoalProgressInput = {
      goalId,
      measurementResults: inputs.measurementResults,
      actionResult: inputs.actionResult,
      childGoalResults: inputs.childGoalResults,
    };
    const goalProgress = this.rules.calculateGoal(goalInput);
    return {
      goalId,
      goalProgress,
      measurementProgress: inputs.measurementResults,
      actionCompletion: inputs.actionResult,
      childGoalProgress: inputs.childGoalResults,
      calculationStatus: this.rules.combineStatuses([
        goalProgress.calculationStatus,
        ...inputs.measurementResults.map((item) => item.calculationStatus),
        ...(inputs.actionResult ? [inputs.actionResult.calculationStatus] : []),
        ...inputs.childGoalResults.map((item) => item.calculationStatus),
      ]),
    };
  }

  async getProgressSummary(user: AuthenticatedUserContext, goalIds: string[]): Promise<ProgressSummary[]> {
    this.assertAuthenticated(user);
    if (!Array.isArray(goalIds) || goalIds.some((id) => !id?.trim())) {
      throw new ProgressError("PROGRESS_INVALID_INPUT", "Goal IDs must be a list of non-empty IDs.");
    }
    const summaries: ProgressSummary[] = [];
    for (const goalId of goalIds) summaries.push(await this.getGoalProgressSummary(user, goalId));
    return summaries;
  }

  async getProgressDataForReview(
    user: AuthenticatedUserContext, goalId: string,
  ): Promise<ProgressSummary> {
    return this.getGoalProgressSummary(user, goalId);
  }

  async saveProgressSnapshot(user: AuthenticatedUserContext, summary: ProgressSummary): Promise<void> {
    this.assertAuthenticated(user);
    if (!this.history?.saveSnapshot) {
      throw new ProgressError("PROGRESS_RULE_NOT_CONFIGURED", "Progress snapshot persistence is not configured.");
    }
    await this.sources.assertCanAccessGoal(user, summary.goalId);
    await this.history.saveSnapshot(user.userId, summary.goalId, summary);
  }

  private assertAuthenticated(user: AuthenticatedUserContext): void {
    if (!user || user.isAuthenticated !== true || !user.userId) {
      throw new ProgressError("PROGRESS_ACCESS_DENIED", "Authenticated user context is required.");
    }
  }
}
