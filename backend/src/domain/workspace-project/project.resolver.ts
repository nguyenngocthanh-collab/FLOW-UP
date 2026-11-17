import type { ProjectId, ProjectReader, WorkspaceReader, ProjectOwnerResolution } from "./workspace-project.types";

/** Project ownership is inherited only through its authoritative Workspace relationship. */
export function resolveProjectOwner(
  projectId: ProjectId,
  projects: ProjectReader,
  workspaces: WorkspaceReader,
): ProjectOwnerResolution {
  const project = projects.getProject(projectId);
  if (!project) return { status: "PROJECT_NOT_FOUND" };
  if (!project.workspaceId) return { status: "OWNERSHIP_UNRESOLVED" };

  const workspace = workspaces.getWorkspace(project.workspaceId);
  if (!workspace) return { status: "WORKSPACE_NOT_FOUND" };
  if (!workspace.ownerUserId) return { status: "OWNERSHIP_UNRESOLVED" };

  return {
    status: "RESOLVED",
    projectId: project.id,
    workspaceId: workspace.id,
    ownerUserId: workspace.ownerUserId,
  };
}
