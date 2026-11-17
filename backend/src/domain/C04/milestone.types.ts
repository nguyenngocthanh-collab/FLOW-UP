export type MilestoneId = string & { readonly __brand: "MilestoneId" };
export type GoalId = string & { readonly __brand: "GoalId" };

export interface Milestone {
  readonly id: MilestoneId;
  readonly goalId: GoalId;
  readonly title: string;
  readonly description: string | null;
  readonly targetDate: string | null; // Calendar date, not a timestamp or schedule.
  readonly status: string; // Deliberately open until the official enum is approved.
  readonly position: number;
  readonly completedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MilestoneReference {
  readonly id: MilestoneId;
  readonly goalId: GoalId;
  readonly status: string;
}

export interface GoalReference {
  readonly id: GoalId;
  readonly accessible: boolean;
  readonly valid: boolean;
}
