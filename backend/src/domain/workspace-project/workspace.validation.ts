import type { UserId, Workspace, WorkspaceId, WorkspaceReader, C02ValidationResult } from "./workspace-project.types";

export type WorkspaceOwnershipError = "WORKSPACE_NOT_FOUND" | "WORKSPACE_ACCESS_DENIED" | "WORKSPACE_OWNER_INVALID";

export function validateWorkspaceOwnership(
  callerUserId: UserId,
  workspaceId: WorkspaceId,
  reader: WorkspaceReader,
): C02ValidationResult<WorkspaceOwnershipError> {
  const workspace = reader.getWorkspace(workspaceId);
  if (!workspace) return { valid: false, code: "WORKSPACE_NOT_FOUND" };
  if (!workspace.ownerUserId) return { valid: false, code: "WORKSPACE_OWNER_INVALID" };
  if (workspace.ownerUserId !== callerUserId) return { valid: false, code: "WORKSPACE_ACCESS_DENIED" };
  return { valid: true };
}

export function validatePersonalWorkspaceUniqueness(
  ownerUserId: UserId,
  reader: WorkspaceReader,
): C02ValidationResult<"WORKSPACE_ALREADY_EXISTS"> {
  return reader.getPersonalWorkspaceByOwner(ownerUserId)
    ? { valid: false, code: "WORKSPACE_ALREADY_EXISTS" }
    : { valid: true };
}

/** Structural guard for data returned by persistence; it does not create or mutate a Workspace. */
export function isValidWorkspace(workspace: Workspace | null): workspace is Workspace {
  return !!workspace && !!workspace.id && !!workspace.ownerUserId && !!workspace.createdAt && !!workspace.updatedAt;
}
