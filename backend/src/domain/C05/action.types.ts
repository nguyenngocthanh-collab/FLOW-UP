export type ActionId = string & { readonly __brand: "ActionId" };
export type GoalId = string & { readonly __brand: "GoalId" };
export type MilestoneId = string & { readonly __brand: "MilestoneId" };

/** Status remains an open string until Product Owner approves the status enum. */
export interface Action {
  readonly id: ActionId;
  readonly goalId: GoalId | null;
  readonly milestoneId: MilestoneId | null;
  readonly title: string;
  readonly description: string | null;
  readonly status: string;
  readonly completedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Storage shape intentionally remains unspecified; this is a domain contract. */
export interface ExecutionData {
  readonly actionId: ActionId;
  readonly actualStartedAt: string | null;
  readonly actualCompletedAt: string | null;
  readonly actualDurationMinutes: number | null;
  readonly executionNote: string | null;
}
