import { describe, expect, it } from "vitest";
import { resolveProjectOwner, validateProjectScope, validateProjectName } from "../../../src/domain/workspace-project";
import type { Project, ProjectReader, Workspace, WorkspaceReader } from "../../../src/domain/workspace-project";

const workspaceA: Workspace = { id: "ws-a", ownerUserId: "user-a", createdAt: "t", updatedAt: "t" };
const workspaceB: Workspace = { id: "ws-b", ownerUserId: "user-b", createdAt: "t", updatedAt: "t" };
const projectA: Project = { id: "p-a", workspaceId: "ws-a", name: "Project A", createdAt: "t", updatedAt: "t" };
const projects: ProjectReader = { getProject: (id) => id === "p-a" ? projectA : null };
const workspaces: WorkspaceReader = {
  getWorkspace: (id) => id === "ws-a" ? workspaceA : id === "ws-b" ? workspaceB : null,
  getPersonalWorkspaceByOwner: (owner) => owner === "user-a" ? workspaceA : owner === "user-b" ? workspaceB : null,
};

describe("C02 Project rules", () => {
  it("resolves Project owner through Workspace", () => expect(resolveProjectOwner("p-a", projects, workspaces)).toEqual({ status: "RESOLVED", projectId: "p-a", workspaceId: "ws-a", ownerUserId: "user-a" }));
  it("rejects an unknown Project", () => expect(resolveProjectOwner("missing", projects, workspaces)).toEqual({ status: "PROJECT_NOT_FOUND" }));
  it("allows the Workspace owner in the matching scope", () => expect(validateProjectScope("user-a", "p-a", "ws-a", projects, workspaces)).toEqual({ valid: true }));
  it("rejects a different Workspace", () => expect(validateProjectScope("user-a", "p-a", "ws-b", projects, workspaces)).toEqual({ valid: false, code: "PROJECT_WORKSPACE_MISMATCH" }));
  it("rejects a different owner", () => expect(validateProjectScope("user-b", "p-a", "ws-a", projects, workspaces)).toEqual({ valid: false, code: "PROJECT_ACCESS_DENIED" }));
  it("requires a non-empty Project name", () => expect(validateProjectName("   ")).toEqual({ valid: false, code: "PROJECT_INVALID_NAME" }));
});
