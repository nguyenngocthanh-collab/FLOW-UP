import type { Action, ActionId, ExecutionData, GoalId, MilestoneId } from "./action.types";
import type { DomainError } from "./action.errors";

export interface ActionGoalReader {
  getGoal(goalId: GoalId): Promise<{ id: GoalId; accessible: boolean; valid: boolean } | null>;
}
export interface ActionMilestoneReader {
  getMilestone(milestoneId: MilestoneId): Promise<{
    id: MilestoneId; goalId: GoalId; accessible: boolean; valid: boolean; status: string;
  } | null>;
}
/** C05 owns Action mutation. Other modules receive read-only facts/contracts. */
export interface ActionReader {
  getAction(id: ActionId): Promise<Action | null>;
  getActionsByGoal(goalId: GoalId): Promise<readonly Action[]>;
  getActionsByMilestone(milestoneId: MilestoneId): Promise<readonly Action[]>;
}
export interface ExecutionDataReader {
  getExecutionData(actionId: ActionId): Promise<ExecutionData | null>;
}
export interface ActionFacts {
  readonly id: ActionId;
  readonly goalId: GoalId | null;
  readonly milestoneId: MilestoneId | null;
  readonly title: string;
  readonly status: string;
  readonly completedAt: string | null;
}
export function toActionFacts(action: Action): ActionFacts {
  return { id: action.id, goalId: action.goalId, milestoneId: action.milestoneId,
    title: action.title, status: action.status, completedAt: action.completedAt };
}
export type ActionValidationResult = { valid: true } | { valid: false; error: DomainError };
