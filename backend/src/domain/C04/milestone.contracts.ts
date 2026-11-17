import type { GoalId, Milestone, MilestoneId, MilestoneReference } from "./milestone.types";
import type { DomainError } from "./milestone.errors";

/** Port only: implementations belong to the owning modules/adapters. */
export interface GoalReader {
  getGoal(goalId: GoalId): Promise<{ id: GoalId; accessible: boolean; valid: boolean } | null>;
}
export interface MilestoneReader {
  getMilestone(id: MilestoneId): Promise<MilestoneReference | null>;
  getMilestonesByGoal(goalId: GoalId): Promise<readonly Milestone[]>;
}
export interface MilestoneActionAssociationPolicy {
  canAssociateAction(milestone: MilestoneReference): Promise<boolean>;
}
export interface MilestoneFacts {
  readonly id: MilestoneId;
  readonly goalId: GoalId;
  readonly title: string;
  readonly status: string;
  readonly targetDate: string | null;
  readonly completedAt: string | null;
}
export function toMilestoneFacts(value: Milestone): MilestoneFacts {
  return { id: value.id, goalId: value.goalId, title: value.title, status: value.status,
    targetDate: value.targetDate, completedAt: value.completedAt };
}
export type MilestoneValidationResult = { valid: true } | { valid: false; error: DomainError };
