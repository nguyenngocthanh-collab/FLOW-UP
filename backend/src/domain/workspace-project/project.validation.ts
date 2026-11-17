import type { C02ValidationResult, ProjectId, ProjectReader, UserId, WorkspaceId, WorkspaceReader } from "./workspace-project.types";
import { resolveProjectOwner } from "./project.resolver";

export type ProjectScopeError =
  | "PROJECT_NOT_FOUND"
  | "WORKSPACE_NOT_FOUND"
  | "PROJECT_WORKSPACE_MISMATCH"
  | "PROJECT_ACCESS_DENIED";

export function validateProjectScope(
  callerUserId: UserId,
  projectId: ProjectId,
  expectedWorkspaceId: WorkspaceId,
  projects: ProjectReader,
  workspaces: WorkspaceReader,
): C02ValidationResult<ProjectScopeError> {
  const project = projects.getProject(projectId);
  if (!project) return { valid: false, code: "PROJECT_NOT_FOUND" };
  if (project.workspaceId !== expectedWorkspaceId) return { valid: false, code: "PROJECT_WORKSPACE_MISMATCH" };

  const resolution = resolveProjectOwner(projectId, projects, workspaces);
  if (resolution.status === "WORKSPACE_NOT_FOUND") return { valid: false, code: "WORKSPACE_NOT_FOUND" };
  if (resolution.status !== "RESOLVED") return { valid: false, code: "PROJECT_NOT_FOUND" };
  if (resolution.ownerUserId !== callerUserId) return { valid: false, code: "PROJECT_ACCESS_DENIED" };
  return { valid: true };
}

/** Only a minimal non-empty check is applied; max length/character rules remain OPEN in the spec. */
export function validateProjectName(name: string): C02ValidationResult<"PROJECT_INVALID_NAME"> {
  return typeof name === "string" && name.trim().length > 0
    ? { valid: true }
    : { valid: false, code: "PROJECT_INVALID_NAME" };
}
