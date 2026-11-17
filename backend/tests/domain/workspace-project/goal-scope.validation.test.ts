import { describe, expect, it } from "vitest";
import { validateGoalScope, validateGoalScopeMovementScopes } from "../../../src/domain/workspace-project";
import type { Project, ProjectReader, Workspace, WorkspaceReader } from "../../../src/domain/workspace-project";

const wsA: Workspace = { id: "ws-a", ownerUserId: "user-a", createdAt: "t", updatedAt: "t" };
const wsB: Workspace = { id: "ws-b", ownerUserId: "user-b", createdAt: "t", updatedAt: "t" };
const project: Project = { id: "p-a", workspaceId: "ws-a", name: "A", createdAt: "t", updatedAt: "t" };
const projects: ProjectReader = { getProject: (id) => id === "p-a" ? project : null };
const workspaces: WorkspaceReader = {
  getWorkspace: (id) => id === "ws-a" ? wsA : id === "ws-b" ? wsB : null,
  getPersonalWorkspaceByOwner: (owner) => owner === "user-a" ? wsA : owner === "user-b" ? wsB : null,
};

describe("C02 Goal scope rules", () => {
  it("allows an independent Workspace Goal", () => expect(validateGoalScope("user-a", { workspaceId: "ws-a", projectId: null }, projects, workspaces)).toEqual({ valid: true }));
  it("allows a Project-owned Goal in the same Workspace", () => expect(validateGoalScope("user-a", { workspaceId: "ws-a", projectId: "p-a" }, projects, workspaces)).toEqual({ valid: true }));
  it("rejects a Project from another Workspace", () => expect(validateGoalScope("user-a", { workspaceId: "ws-b", projectId: "p-a" }, projects, workspaces)).toEqual({ valid: false, code: "GOAL_SCOPE_ACCESS_DENIED" }));
  it("rejects an unknown Project", () => expect(validateGoalScope("user-a", { workspaceId: "ws-a", projectId: "missing" }, projects, workspaces)).toEqual({ valid: false, code: "PROJECT_NOT_FOUND" }));
  it("validates movement source and destination scopes without mutating a Goal", () => expect(validateGoalScopeMovementScopes({ callerUserId: "user-a", goalId: "g-a", sourceScope: { workspaceId: "ws-a", projectId: null }, destinationScope: { workspaceId: "ws-a", projectId: "p-a" } }, projects, workspaces)).toEqual({ valid: true }));
});
