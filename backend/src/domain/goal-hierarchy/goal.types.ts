/**
 * C03 — Goal & Hierarchy domain contracts.
 * Identifier formats remain opaque until D03 standardizes shared identifiers.
 */
export type GoalId = string;
export type UserId = string;
export type WorkspaceId = string;
export type ProjectId = string;

export type GoalStatus = string;
/**
 * The specification has not approved GoalStatus values. This alias deliberately
 * does not publish an enum or imply lifecycle transitions.
 */

export interface GoalScope {
  readonly workspaceId: WorkspaceId;
  /** null = independent Workspace Goal; non-null = Project-owned Goal. */
  readonly projectId: ProjectId | null;
}

export interface Goal {
  readonly id: GoalId;
  readonly workspaceId: WorkspaceId;
  readonly projectId: ProjectId | null;
  readonly parentGoalId: GoalId | null;
  readonly title: string;
  readonly description: string | null;
  /** Calendar date (YYYY-MM-DD), not a timestamp or Action Schedule. */
  readonly targetDate: string | null;
  /** Status remains opaque until GOAL-001 is approved. */
  readonly status?: GoalStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface GoalReader {
  getGoal(id: GoalId): Goal | null;
  getGoals(): readonly Goal[];
}

export interface GoalScopeValidator {
  validate(
    callerUserId: UserId,
    scope: GoalScope,
  ): { readonly valid: true } | { readonly valid: false; readonly code: string };
}

export interface GoalOwnershipValidator {
  validateGoalOwnership(
    callerUserId: UserId,
    goalId: GoalId,
  ): { readonly valid: true } | { readonly valid: false; readonly code: string };
}

export type C03ValidationResult<TCode extends string> =
  | { readonly valid: true }
  | { readonly valid: false; readonly code: TCode };
