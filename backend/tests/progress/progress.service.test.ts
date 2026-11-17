import { describe, expect, it, vi } from "vitest";
import { ProgressService } from "../../src/modules/progress";
import type {
  AuthenticatedUserContext, GoalProgressInput, GoalProgressResult, MeasurementProgressInput,
} from "../../src/modules/progress";

const user: AuthenticatedUserContext = { userId: "user-1", email: null, isAuthenticated: true };
const goalResult: GoalProgressResult = {
  goalId: "goal-1", progressValue: null, calculationStatus: "RULE_NOT_CONFIGURED",
  contributingSources: [], calculationContext: {},
};

function setup() {
  const sources = {
    assertCanAccessGoal: vi.fn(async () => undefined),
    getMeasurementProgressInputs: vi.fn(async () => []),
    getActionProgressInput: vi.fn(async () => ({ goalId: "goal-1", actions: [] })),
    getChildGoalIds: vi.fn(async () => []),
    getGoalProgressInputs: vi.fn(async () => ({
      measurementResults: [], actionResult: null, childGoalResults: [],
    })),
  };
  const rules = {
    calculateMeasurement: vi.fn((input: MeasurementProgressInput) => ({
      measurementId: input.measurementId, currentValue: input.currentValue,
      targetValue: input.targetValue, progressValue: null,
      calculationStatus: "RULE_NOT_CONFIGURED" as const, calculationContext: {},
    })),
    calculateActionCompletion: vi.fn(),
    calculateGoal: vi.fn((input: GoalProgressInput) => ({ ...goalResult, goalId: input.goalId })),
    aggregateChildGoals: vi.fn(),
    compareMeasurement: vi.fn(() => ({
      difference: 0.5, comparisonStatus: "RULE_NOT_CONFIGURED", progressValue: null,
    })),
    combineStatuses: vi.fn(() => "RULE_NOT_CONFIGURED" as const),
  };
  return { service: new ProgressService(sources, rules), sources, rules };
}

describe("ProgressService", () => {
  it("delegates Measurement calculation to approved rules", () => {
    const { service, rules } = setup();
    service.calculateMeasurementProgress(user, {
      measurementId: "m-1", currentValue: 6.5, targetValue: 7, unit: "Band Score", valueType: "NUMBER",
    });
    expect(rules.calculateMeasurement).toHaveBeenCalled();
  });

  it("delegates Action Completion to approved rules", () => {
    const { service, rules } = setup();
    service.calculateActionCompletion(user, {
      goalId: "goal-1", actions: [{ id: "a-1", status: "COMPLETED" }],
    });
    expect(rules.calculateActionCompletion).toHaveBeenCalled();
  });

  it("checks Goal ownership before building a summary", async () => {
    const { service, sources, rules } = setup();
    const result = await service.getGoalProgressSummary(user, "goal-1");
    expect(sources.assertCanAccessGoal).toHaveBeenCalledWith(user, "goal-1");
    expect(rules.calculateGoal).toHaveBeenCalled();
    expect(result.goalId).toBe("goal-1");
  });

  it("does not invent a percentage when rules are not configured", () => {
    const { service } = setup();
    const result = service.calculateMeasurementProgress(user, {
      measurementId: "m-1", currentValue: 6.5, targetValue: 7, unit: "Band Score", valueType: "NUMBER",
    });
    expect(result.progressValue).toBeNull();
    expect(result.calculationStatus).toBe("RULE_NOT_CONFIGURED");
  });
});
