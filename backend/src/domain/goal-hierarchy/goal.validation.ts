import type {
  C03ValidationResult,
  Goal,
  GoalId,
  GoalScope,
  GoalScopeValidator,
} from "./goal.types";

export type GoalAttributeError =
  | "GOAL_INVALID_ID"
  | "GOAL_INVALID_TITLE"
  | "GOAL_INVALID_DESCRIPTION"
  | "GOAL_INVALID_TARGET_DATE";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function isRealCalendarDate(value: string): boolean {
  if (!DATE_ONLY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

/** Only constraints explicitly supported by C03 are enforced. Length limits remain OPEN. */
export function validateGoalAttributes(input: {
  readonly id: GoalId;
  readonly title: string;
  readonly description?: string | null;
  readonly targetDate?: string | null;
}): C03ValidationResult<GoalAttributeError> {
  if (typeof input.id !== "string" || input.id.trim().length === 0) {
    return { valid: false, code: "GOAL_INVALID_ID" };
  }
  if (typeof input.title !== "string" || input.title.trim().length === 0) {
    return { valid: false, code: "GOAL_INVALID_TITLE" };
  }
  if (input.description !== undefined && input.description !== null
      && typeof input.description !== "string") {
    return { valid: false, code: "GOAL_INVALID_DESCRIPTION" };
  }
  if (input.targetDate !== undefined && input.targetDate !== null
      && !isRealCalendarDate(input.targetDate)) {
    return { valid: false, code: "GOAL_INVALID_TARGET_DATE" };
  }
  return { valid: true };
}

export function toGoalScope(goal: Pick<Goal, "workspaceId" | "projectId">): GoalScope {
  return { workspaceId: goal.workspaceId, projectId: goal.projectId };
}

/** Delegates Workspace/Project truth to C02; C03 does not duplicate those rules. */
export function validateGoalScope(
  callerUserId: string,
  scope: GoalScope,
  validator: GoalScopeValidator,
): C03ValidationResult<"GOAL_SCOPE_INVALID" | "GOAL_SCOPE_ACCESS_DENIED"> {
  if (!scope || typeof scope.workspaceId !== "string" || scope.workspaceId.trim() === ""
      || (scope.projectId !== null && (typeof scope.projectId !== "string" || scope.projectId.trim() === ""))) {
    return { valid: false, code: "GOAL_SCOPE_INVALID" };
  }
  const result = validator.validate(callerUserId, scope);
  if (result.valid) return { valid: true };
  return {
    valid: false,
    code: result.code.includes("ACCESS_DENIED") ? "GOAL_SCOPE_ACCESS_DENIED" : "GOAL_SCOPE_INVALID",
  };
}
