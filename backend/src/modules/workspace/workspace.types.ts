import type { AuthenticatedUserContext } from "../auth/auth.types";

export type { AuthenticatedUserContext };

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
}

export interface WorkspaceGoalSummary {
  independentGoalCount: number;
}

export interface ProjectGoalSummary {
  goalCount: number;
}

export interface WorkspaceOverview {
  workspace: Workspace;
  projects: Project[];
  goalSummary: WorkspaceGoalSummary | null;
}

export interface ProjectOverview {
  project: Project;
  goalSummary: ProjectGoalSummary | null;
}

export type WorkspaceErrorCode =
  | "WORKSPACE_NOT_FOUND"
  | "WORKSPACE_ALREADY_EXISTS"
  | "WORKSPACE_ACCESS_DENIED"
  | "WORKSPACE_INITIALIZATION_FAILED"
  | "WORKSPACE_INVALID_OWNER"
  | "WORKSPACE_INVALID_NAME"
  | "PROJECT_NOT_FOUND"
  | "PROJECT_ACCESS_DENIED"
  | "PROJECT_INVALID_NAME"
  | "PROJECT_INVALID_INPUT"
  | "PROJECT_CREATION_FAILED"
  | "PROJECT_UPDATE_FAILED"
  | "WORKSPACE_PROVIDER_ERROR"
  | "WORKSPACE_UNKNOWN_ERROR"
  | "WORKSPACE_UNAUTHENTICATED";

export interface WorkspaceError {
  code: WorkspaceErrorCode;
  message: string;
}

export type WorkspaceResult<T> =
  | { success: true; data: T }
  | { success: false; error: WorkspaceError };

export interface WorkspaceService {
  listWorkspaces(user: AuthenticatedUserContext): Promise<WorkspaceResult<Workspace[]>>;
  createWorkspace(user: AuthenticatedUserContext, name: string): Promise<WorkspaceResult<Workspace>>;
  deleteWorkspace(user: AuthenticatedUserContext, workspaceId: string): Promise<WorkspaceResult<boolean>>;
  initializePersonalWorkspace(
    user: AuthenticatedUserContext
  ): Promise<WorkspaceResult<Workspace>>;

  getCurrentWorkspace(
    user: AuthenticatedUserContext
  ): Promise<WorkspaceResult<Workspace>>;

  getWorkspaceOverview(
    user: AuthenticatedUserContext
  ): Promise<WorkspaceResult<WorkspaceOverview>>;

  createProject(
    user: AuthenticatedUserContext,
    input: CreateProjectInput
  ): Promise<WorkspaceResult<Project>>;

  getProject(
    user: AuthenticatedUserContext,
    projectId: string
  ): Promise<WorkspaceResult<Project>>;

  listProjects(
    user: AuthenticatedUserContext
  ): Promise<WorkspaceResult<Project[]>>;

  updateProject(
    user: AuthenticatedUserContext,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<WorkspaceResult<Project>>;

  getProjectOverview(
    user: AuthenticatedUserContext,
    projectId: string
  ): Promise<WorkspaceResult<ProjectOverview>>;

  validateWorkspaceOwnership(
    user: AuthenticatedUserContext,
    workspaceId: string
  ): Promise<WorkspaceResult<boolean>>;

  validateProjectOwnership(
    user: AuthenticatedUserContext,
    projectId: string
  ): Promise<WorkspaceResult<boolean>>;
}
