import { describe, expect, it } from "vitest";
import {
  checkResourceOwnershipAccess,
  validateRelatedResourceOwnership,
  validateResourceOwnership,
  validateOwnerUnchanged,
} from "../../../src/domain/identity-ownership";
import type { OwnershipGraphReader, OwnershipNode, ResourceReference, UserId } from "../../../src/domain/identity-ownership";

const userA = "user_A" as UserId;
const userB = "user_B" as UserId;
const ref = (resourceType: string, resourceId: string): ResourceReference => ({ resourceType, resourceId });

const nodes: OwnershipNode[] = [
  { ref: ref("workspace", "a"), directOwnerUserId: userA },
  { ref: ref("workspace", "b"), directOwnerUserId: userB },
  { ref: ref("project", "a1"), parentResources: [ref("workspace", "a")] },
  { ref: ref("goal", "a1"), parentResources: [ref("project", "a1")] },
];
const graph: OwnershipGraphReader = {
  getOwnershipNode: (target) => nodes.find(
    (node) => node.ref.resourceType === target.resourceType && node.ref.resourceId === target.resourceId,
  ),
};

describe("C01 ownership validation and access policy", () => {
  it("allows the owner and rejects another user", () => {
     expect(validateResourceOwnership(userA, ref("workspace", "a"), graph).valid).toBe(true);
     expect(validateResourceOwnership(userB, ref("workspace", "a"), graph))
    .toEqual({ valid: false, code: "OWNERSHIP_MISMATCH" });
  });

  it("rejects missing caller identity", () => {
    expect(validateResourceOwnership(undefined, ref("workspace", "a"), graph))
      .toEqual({ valid: false, code: "IDENTITY_REQUIRED" });
  });

  it("validates related resources under the same owner", () => {
    expect(validateRelatedResourceOwnership(userA, ref("workspace", "a"), ref("goal", "a1"), graph).valid).toBe(true);
    expect(validateRelatedResourceOwnership(userA, ref("workspace", "a"), ref("workspace", "b"), graph))
      .toEqual({ valid: false, code: "RELATED_RESOURCE_ACCESS_DENIED" });
  });

  it("returns an access decision without implementing HTTP authorization", () => {
    expect(checkResourceOwnershipAccess(userA, ref("project", "a1"), "READ", graph).allowed).toBe(true);
    expect(checkResourceOwnershipAccess(userB, ref("project", "a1"), "UPDATE", graph))
      .toEqual({ allowed: false, code: "RESOURCE_ACCESS_DENIED" });
  });

  it("does not allow ordinary ownership changes", () => {
    expect(validateOwnerUnchanged(userA, userA)).toEqual({ valid: true });
    expect(validateOwnerUnchanged(userA, userB))
      .toEqual({ valid: false, code: "OWNERSHIP_MODIFICATION_FORBIDDEN" });
  });
});
