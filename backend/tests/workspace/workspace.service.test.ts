import { describe, expect, it, vi } from "vitest";
import { createWorkspaceService } from "../../src/modules/workspace/workspace.service";
import type { WorkspaceRepository } from "../../src/modules/workspace/workspace.repository";
import type { Project, Workspace } from "../../src/modules/workspace/workspace.types";

const user = {
  userId: "user-1",
  email: "user@example.com",
  isAuthenticated: true as const
};

const workspace: Workspace = {
  id: "workspace-1",
  userId: "user-1",
  name: "Personal Workspace",
  createdAt: "2026-11-17T00:00:00.000Z",
  updatedAt: "2026-11-17T00:00:00.000Z"
};

const project: Project = {
  id: "project-1",
  workspaceId: "workspace-1",
  name: "FLOW-UP",
  description: null,
  createdAt: "2026-11-17T00:00:00.000Z",
  updatedAt: "2026-11-17T00:00:00.000Z"
};

function makeRepository(): WorkspaceRepository {
  return {
    getOrCreatePersonalWorkspace: vi.fn(async () => workspace),
    findWorkspaceByUserId: vi.fn(async () => workspace),
    findWorkspaceById: vi.fn(async () => workspace),
    listWorkspacesByUserId: vi.fn(async () => [workspace]),
    createWorkspace: vi.fn(async (_userId, name) => ({ ...workspace, id: "workspace-2", name })),
    deleteWorkspace: vi.fn(async () => true),
    createProject: vi.fn(async () => project),
    findProjectById: vi.fn(async () => project),
    listProjectsByWorkspaceId: vi.fn(async () => [project]),
    updateProject: vi.fn(async (_id, input) => ({
      ...project,
      ...input,
      name: input.name ?? project.name,
      description:
        input.description === undefined ? project.description : input.description
    }))
  };
}

describe("B02 workspace service", () => {
  it("creates separately named workspaces for the authenticated owner", async () => {
    const repository = makeRepository();
    const service = createWorkspaceService(repository);
    const result = await service.createWorkspace(user, "Research project");
    expect(result).toMatchObject({ success: true, data: { name: "Research project", userId: "user-1" } });
    expect(repository.createWorkspace).toHaveBeenCalledWith("user-1", "Research project");
  });

  it("does not delete a workspace owned by someone else", async () => {
    const repository = makeRepository();
    repository.findWorkspaceById = vi.fn(async () => ({ ...workspace, userId: "user-other" }));
    const service = createWorkspaceService(repository);
    const result = await service.deleteWorkspace(user, "workspace-other");
    expect(result).toMatchObject({ success: false, error: { code: "WORKSPACE_ACCESS_DENIED" } });
    expect(repository.deleteWorkspace).not.toHaveBeenCalled();
  });

  it("initializes or retrieves the personal workspace through the repository", async () => {
    const repository = makeRepository();
    const service = createWorkspaceService(repository);

    const result = await service.initializePersonalWorkspace(user);

    expect(result).toEqual({ success: true, data: workspace });
    expect(repository.getOrCreatePersonalWorkspace).toHaveBeenCalledWith("user-1");
  });

  it("creates a project inside the authenticated user's workspace", async () => {
    const repository = makeRepository();
    const service = createWorkspaceService(repository);

    const result = await service.createProject(user, {
      name: " FLOW-UP ",
      description: " MVP "
    });

    expect(result.success).toBe(true);
    expect(repository.createProject).toHaveBeenCalledWith("workspace-1", {
      name: "FLOW-UP",
      description: "MVP"
    });
  });

  it("rejects a project owned by another user's workspace", async () => {
    const repository = makeRepository();
    repository.findProjectById = vi.fn(async () => ({
      ...project,
      workspaceId: "workspace-other"
    }));
    const service = createWorkspaceService(repository);

    const result = await service.getProject(user, "project-other");

    expect(result).toMatchObject({
      success: false,
      error: { code: "PROJECT_ACCESS_DENIED" }
    });
  });

  it("does not create a project when name is invalid", async () => {
    const repository = makeRepository();
    const service = createWorkspaceService(repository);

    const result = await service.createProject(user, { name: " " });

    expect(result).toMatchObject({
      success: false,
      error: { code: "PROJECT_INVALID_NAME" }
    });
    expect(repository.createProject).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated calls", async () => {
    const repository = makeRepository();
    const service = createWorkspaceService(repository);

    const result = await service.getCurrentWorkspace({
      userId: "",
      email: null,
      isAuthenticated: true
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "WORKSPACE_UNAUTHENTICATED" }
    });
  });
});
