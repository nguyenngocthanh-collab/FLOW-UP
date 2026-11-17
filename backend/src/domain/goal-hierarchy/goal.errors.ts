export const C03_ERROR_CODES = [
  "GOAL_NOT_FOUND",
  "GOAL_INVALID_ID",
  "GOAL_INVALID_TITLE",
  "GOAL_INVALID_DESCRIPTION",
  "GOAL_INVALID_TARGET_DATE",
  "GOAL_SCOPE_INVALID",
  "GOAL_SCOPE_ACCESS_DENIED",
  "GOAL_PARENT_NOT_FOUND",
  "GOAL_PARENT_INVALID",
  "GOAL_SELF_PARENTING",
  "GOAL_HIERARCHY_CYCLE",
  "GOAL_HIERARCHY_INVALID",
  "GOAL_OWNERSHIP_INVALID",
  "GOAL_SCOPE_POLICY_UNRESOLVED",
  "GOAL_SCOPE_MOVEMENT_INVALID",
  "GOAL_SCOPE_MOVEMENT_BLOCKED",
  "GOAL_DEPENDENCY_CONFLICT",
] as const;

export type C03ErrorCode = (typeof C03_ERROR_CODES)[number];

export class C03DomainError extends Error {
  constructor(
    public readonly code: C03ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "C03DomainError";
  }
}
