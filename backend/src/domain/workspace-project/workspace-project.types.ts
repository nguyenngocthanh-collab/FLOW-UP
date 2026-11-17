/** C02 domain identifiers. Keep as strings until D03 centralizes shared branded IDs. */
export type UserId = string;
export type WorkspaceId = string;
export type ProjectId = string;
export type GoalId = string;

export interface Workspace {
  readonly id: WorkspaceId;
  readonly ownerUserId: UserId;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Project {
  readonly id: ProjectId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface GoalScope {
  readonly workspaceId: WorkspaceId;
  /** null means independent Workspace scope; otherwise Project scope. */
  readonly projectId: ProjectId | null;
}

export interface WorkspaceReader {
  getWorkspace(id: WorkspaceId): Workspace | null;
  getPersonalWorkspaceByOwner(ownerUserId: UserId): Workspace | null;
}

export interface ProjectReader {
  getProject(id: ProjectId): Project | null;
}

export type C02ValidationResult<TCode extends string> =
  | { readonly valid: true }
  | { readonly valid: false; readonly code: TCode };

export type ProjectOwnerResolution =
  | { readonly status: "RESOLVED"; readonly projectId: ProjectId; readonly workspaceId: WorkspaceId; readonly ownerUserId: UserId }
  | { readonly status: "PROJECT_NOT_FOUND" }
  | { readonly status: "WORKSPACE_NOT_FOUND" }
  | { readonly status: "OWNERSHIP_UNRESOLVED" }
  | { readonly status: "OWNERSHIP_INCONSISTENT" };
