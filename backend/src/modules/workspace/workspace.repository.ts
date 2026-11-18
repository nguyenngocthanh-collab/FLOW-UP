import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
  Workspace
} from "./workspace.types";

/**
 * D01 persistence boundary.
 *
 * getOrCreatePersonalWorkspace MUST be atomic and return a deterministic existing
 * personal workspace or create one when the owner has no workspace yet.
 */
export interface WorkspaceRepository {
  getOrCreatePersonalWorkspace(userId: string): Promise<Workspace>;
  findWorkspaceByUserId(userId: string): Promise<Workspace | null>;
  findWorkspaceById(workspaceId: string): Promise<Workspace | null>;
  listWorkspacesByUserId(userId: string): Promise<Workspace[]>;
  createWorkspace(userId: string, name: string): Promise<Workspace>;
  deleteWorkspace(workspaceId: string, userId: string): Promise<boolean>;

  createProject(
    workspaceId: string,
    input: CreateProjectInput
  ): Promise<Project>;

  findProjectById(projectId: string): Promise<Project | null>;
  listProjectsByWorkspaceId(workspaceId: string): Promise<Project[]>;

  updateProject(
    projectId: string,
    input: UpdateProjectInput
  ): Promise<Project>;
}

/**
 * B03 read-only boundary. B02 must not own or mutate Goal entities.
 * Return null from the service overview when B03 has not been connected yet.
 */
export interface GoalSummaryReader {
  getIndependentGoalCount(workspaceId: string): Promise<number>;
  getProjectGoalCount(projectId: string): Promise<number>;
}
