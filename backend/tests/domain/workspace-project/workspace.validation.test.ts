import { describe, expect, it } from "vitest";
import { validatePersonalWorkspaceUniqueness, validateWorkspaceOwnership } from "../../../src/domain/workspace-project";
import type { Workspace, WorkspaceReader } from "../../../src/domain/workspace-project";

const workspace: Workspace = { id: "ws-a", ownerUserId: "user-a", createdAt: "2026-01-01", updatedAt: "2026-01-01" };
function reader(item: Workspace | null = workspace): WorkspaceReader {
  return {
    getWorkspace: (id) => item?.id === id ? item : null,
    getPersonalWorkspaceByOwner: (owner) => item?.ownerUserId === owner ? item : null,
  };
}

describe("C02 Workspace validation", () => {
  it("allows the owner", () => expect(validateWorkspaceOwnership("user-a", "ws-a", reader())).toEqual({ valid: true }));
  it("rejects another user", () => expect(validateWorkspaceOwnership("user-b", "ws-a", reader())).toEqual({ valid: false, code: "WORKSPACE_ACCESS_DENIED" }));
  it("rejects a missing Workspace", () => expect(validateWorkspaceOwnership("user-a", "missing", reader())).toEqual({ valid: false, code: "WORKSPACE_NOT_FOUND" }));
  it("rejects a second Personal Workspace", () => expect(validatePersonalWorkspaceUniqueness("user-a", reader())).toEqual({ valid: false, code: "WORKSPACE_ALREADY_EXISTS" }));
  it("allows initialization when none exists", () => expect(validatePersonalWorkspaceUniqueness("user-b", reader())).toEqual({ valid: true }));
});
