import { createWorkspaceError } from "./workspace.errors";
import type { GoalSummaryReader, WorkspaceRepository } from "./workspace.repository";
import type {
  AuthenticatedUserContext,
  CreateProjectInput,
  Project,
  ProjectOverview,
  UpdateProjectInput,
  Workspace,
  WorkspaceOverview,
  WorkspaceResult,
  WorkspaceService
} from "./workspace.types";
import {
  validateCreateProjectInput,
  validateUpdateProjectInput
} from "./workspace.validation";

function success<T>(data: T): WorkspaceResult<T> {
  return { success: true, data };
}

function failure<T>(
  code: Parameters<typeof createWorkspaceError>[0]
): WorkspaceResult<T> {
  return { success: false, error: createWorkspaceError(code) };
}

function isTrustedUser(user: AuthenticatedUserContext | null | undefined): user is AuthenticatedUserContext {
  return Boolean(
    user &&
    user.isAuthenticated === true &&
    typeof user.userId === "string" &&
    user.userId.trim().length > 0
  );
}

function normalizePersistenceError<T>(
  error: unknown,
  fallback: Parameters<typeof createWorkspaceError>[0]
): WorkspaceResult<T> {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message).toLowerCase()
      : "";

  if (message.includes("unique") || message.includes("duplicate")) {
    return failure("WORKSPACE_ALREADY_EXISTS");
  }

  return failure(fallback);
}

export function createWorkspaceService(
  repository: WorkspaceRepository,
  goalReader?: GoalSummaryReader
): WorkspaceService {
  async function resolveWorkspace(
    user: AuthenticatedUserContext
  ): Promise<WorkspaceResult<Workspace>> {
    if (!isTrustedUser(user)) return failure("WORKSPACE_UNAUTHENTICATED");

    try {
      const workspace = await repository.findWorkspaceByUserId(user.userId);
      return workspace
        ? success(workspace)
        : failure("WORKSPACE_NOT_FOUND");
    } catch (error) {
      return normalizePersistenceError(error, "WORKSPACE_PROVIDER_ERROR");
    }
  }

  async function resolveOwnedProject(
    user: AuthenticatedUserContext,
    projectId: string
  ): Promise<WorkspaceResult<Project>> {
    if (!isTrustedUser(user)) return failure("WORKSPACE_UNAUTHENTICATED");
    if (!projectId || !projectId.trim()) return failure("PROJECT_NOT_FOUND");

    try {
      const project = await repository.findProjectById(projectId);
      if (!project) return failure("PROJECT_NOT_FOUND");

      const workspace = await repository.findWorkspaceByUserId(user.userId);
      if (!workspace) return failure("WORKSPACE_NOT_FOUND");

      if (project.workspaceId !== workspace.id) {
        return failure("PROJECT_ACCESS_DENIED");
      }

      return success(project);
    } catch (error) {
      return normalizePersistenceError(error, "WORKSPACE_PROVIDER_ERROR");
    }
  }

  return {
    async initializePersonalWorkspace(user) {
      if (!isTrustedUser(user)) return failure("WORKSPACE_UNAUTHENTICATED");

      try {
        // Atomic get-or-create is delegated to D01; B02 does not trust client owner IDs.
        const workspace = await repository.getOrCreatePersonalWorkspace(user.userId);
        if (workspace.userId !== user.userId) {
          return failure("WORKSPACE_INVALID_OWNER");
        }
        return success(workspace);
      } catch (error) {
        return normalizePersistenceError(error, "WORKSPACE_INITIALIZATION_FAILED");
      }
    },

    async getCurrentWorkspace(user) {
      return resolveWorkspace(user);
    },

    async getWorkspaceOverview(user): Promise<WorkspaceResult<WorkspaceOverview>> {
      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      try {
        const projects = await repository.listProjectsByWorkspaceId(
          workspaceResult.data.id
        );

        const goalSummary = goalReader
          ? {
              independentGoalCount: await goalReader.getIndependentGoalCount(
                workspaceResult.data.id
              )
            }
          : null;

        return success({
          workspace: workspaceResult.data,
          projects,
          goalSummary
        });
      } catch (error) {
        return normalizePersistenceError(error, "WORKSPACE_PROVIDER_ERROR");
      }
    },

    async createProject(user, input: CreateProjectInput) {
      if (!isTrustedUser(user)) return failure("WORKSPACE_UNAUTHENTICATED");

      const validation = validateCreateProjectInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "PROJECT_INVALID_INPUT");
      }

      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      try {
        const project = await repository.createProject(
          workspaceResult.data.id,
          {
            name: input.name.trim(),
            description:
              input.description === undefined || input.description === null
                ? null
                : input.description.trim() || null
          }
        );

        if (project.workspaceId !== workspaceResult.data.id) {
          return failure("WORKSPACE_PROVIDER_ERROR");
        }

        return success(project);
      } catch (error) {
        return normalizePersistenceError(error, "PROJECT_CREATION_FAILED");
      }
    },

    async getProject(user, projectId) {
      return resolveOwnedProject(user, projectId);
    },

    async listProjects(user) {
      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      try {
        const projects = await repository.listProjectsByWorkspaceId(
          workspaceResult.data.id
        );

        return success(
          [...projects].sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt)
          )
        );
      } catch (error) {
        return normalizePersistenceError(error, "WORKSPACE_PROVIDER_ERROR");
      }
    },

    async updateProject(user, projectId, input: UpdateProjectInput) {
      const ownedProject = await resolveOwnedProject(user, projectId);
      if (!ownedProject.success) return ownedProject;

      const validation = validateUpdateProjectInput(input);
      if (!validation.valid) {
        return failure(validation.code ?? "PROJECT_INVALID_INPUT");
      }

      const safeInput: UpdateProjectInput = {};
      if (input.name !== undefined) safeInput.name = input.name.trim();
      if (input.description !== undefined) {
        safeInput.description =
          input.description === null ? null : input.description.trim() || null;
      }

      try {
        const updated = await repository.updateProject(projectId, safeInput);

        // A repository implementation must not permit workspace_id or id updates.
        if (
          updated.id !== ownedProject.data.id ||
          updated.workspaceId !== ownedProject.data.workspaceId
        ) {
          return failure("PROJECT_UPDATE_FAILED");
        }

        return success(updated);
      } catch (error) {
        return normalizePersistenceError(error, "PROJECT_UPDATE_FAILED");
      }
    },

    async getProjectOverview(user, projectId): Promise<WorkspaceResult<ProjectOverview>> {
      const projectResult = await resolveOwnedProject(user, projectId);
      if (!projectResult.success) return projectResult;

      try {
        const goalSummary = goalReader
          ? {
              goalCount: await goalReader.getProjectGoalCount(projectId)
            }
          : null;

        return success({
          project: projectResult.data,
          goalSummary
        });
      } catch (error) {
        return normalizePersistenceError(error, "WORKSPACE_PROVIDER_ERROR");
      }
    },

    async validateWorkspaceOwnership(user, workspaceId) {
      if (!isTrustedUser(user)) return failure("WORKSPACE_UNAUTHENTICATED");

      const workspaceResult = await resolveWorkspace(user);
      if (!workspaceResult.success) return workspaceResult;

      if (workspaceResult.data.id !== workspaceId) {
        return failure("WORKSPACE_ACCESS_DENIED");
      }

      return success(true);
    },

    async validateProjectOwnership(user, projectId) {
      const result = await resolveOwnedProject(user, projectId);
      if (!result.success) return result;
      return success(true);
    }
  };
}
