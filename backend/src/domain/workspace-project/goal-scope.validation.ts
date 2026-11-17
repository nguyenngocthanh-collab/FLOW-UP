import type { C02ValidationResult, GoalScope, ProjectReader, UserId, WorkspaceReader } from "./workspace-project.types";
import { validateWorkspaceOwnership } from "./workspace.validation";
import { validateProjectScope } from "./project.validation";

export type GoalScopeError =
  | "WORKSPACE_NOT_FOUND"
  | "PROJECT_NOT_FOUND"
  | "GOAL_PROJECT_WORKSPACE_MISMATCH"
  | "GOAL_SCOPE_INVALID"
  | "GOAL_SCOPE_ACCESS_DENIED";

/** Validates organizational scope only. It does not read, create, or mutate a C03 Goal entity. */
export function validateGoalScope(
  callerUserId: UserId,
  scope: GoalScope,
  projects: ProjectReader,
  workspaces: WorkspaceReader,
): C02ValidationResult<GoalScopeError> {
  if (!scope || !scope.workspaceId || (scope.projectId !== null && !scope.projectId)) {
    return { valid: false, code: "GOAL_SCOPE_INVALID" };
  }

  const workspaceResult = validateWorkspaceOwnership(callerUserId, scope.workspaceId, workspaces);
  if (!workspaceResult.valid) {
    if (workspaceResult.code === "WORKSPACE_NOT_FOUND") return { valid: false, code: "WORKSPACE_NOT_FOUND" };
    return { valid: false, code: "GOAL_SCOPE_ACCESS_DENIED" };
  }

  if (scope.projectId === null) return { valid: true };
  const projectResult = validateProjectScope(callerUserId, scope.projectId, scope.workspaceId, projects, workspaces);
  if (!projectResult.valid) {
    if (projectResult.code === "PROJECT_NOT_FOUND") return { valid: false, code: "PROJECT_NOT_FOUND" };
    if (projectResult.code === "PROJECT_WORKSPACE_MISMATCH") return { valid: false, code: "GOAL_PROJECT_WORKSPACE_MISMATCH" };
    if (projectResult.code === "WORKSPACE_NOT_FOUND") return { valid: false, code: "WORKSPACE_NOT_FOUND" };
    return { valid: false, code: "GOAL_SCOPE_ACCESS_DENIED" };
  }
  return { valid: true };
}
