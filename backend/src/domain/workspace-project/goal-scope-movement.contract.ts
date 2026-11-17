import type { GoalId, GoalScope, UserId, WorkspaceReader, ProjectReader, C02ValidationResult } from "./workspace-project.types";
import { validateGoalScope } from "./goal-scope.validation";

export interface GoalScopeMovementRequest {
  readonly callerUserId: UserId;
  readonly goalId: GoalId;
  readonly sourceScope: GoalScope;
  readonly destinationScope: GoalScope;
}

export type GoalScopeMovementError =
  | "SOURCE_SCOPE_INVALID"
  | "DESTINATION_SCOPE_INVALID"
  | "DESTINATION_ACCESS_DENIED"
  | "HIERARCHY_SCOPE_INVALID"
  | "DEPENDENT_RESOURCE_CONFLICT";

/**
 * C02 scope preflight contract only. C03 must supply hierarchy/dependent-resource checks and
 * own the actual Goal mutation. This function deliberately performs no movement or transaction.
 */
export function validateGoalScopeMovementScopes(
  request: GoalScopeMovementRequest,
  projects: ProjectReader,
  workspaces: WorkspaceReader,
): C02ValidationResult<GoalScopeMovementError> {
  const source = validateGoalScope(request.callerUserId, request.sourceScope, projects, workspaces);
  if (!source.valid) return { valid: false, code: "SOURCE_SCOPE_INVALID" };

  const destination = validateGoalScope(request.callerUserId, request.destinationScope, projects, workspaces);
  if (!destination.valid) {
    return {
      valid: false,
      code: destination.code === "GOAL_SCOPE_ACCESS_DENIED" ? "DESTINATION_ACCESS_DENIED" : "DESTINATION_SCOPE_INVALID",
    };
  }
  return { valid: true };
}
