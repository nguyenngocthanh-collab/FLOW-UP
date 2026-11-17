import { describe, expect, it } from "vitest";
import { resolveResourceOwner } from "../../../src/domain/identity-ownership";
import type { OwnershipGraphReader, OwnershipNode, ResourceReference, UserId } from "../../../src/domain/identity-ownership";

const userA = "user_A" as UserId;
const userB = "user_B" as UserId;
const ref = (resourceType: string, resourceId: string): ResourceReference => ({ resourceType, resourceId });

function graphOf(nodes: OwnershipNode[]): OwnershipGraphReader {
  return {
    getOwnershipNode: (target) => nodes.find(
      (node) => node.ref.resourceType === target.resourceType && node.ref.resourceId === target.resourceId,
    ),
  };
}

describe("C01 ownership resolution", () => {
  it("resolves direct ownership", () => {
    const graph = graphOf([{ ref: ref("workspace", "w1"), directOwnerUserId: userA }]);
    expect(resolveResourceOwner(ref("workspace", "w1"), graph))
      .toEqual({ status: "RESOLVED", ownerUserId: userA });
  });

  it("resolves inherited ownership through a parent", () => {
    const graph = graphOf([
      { ref: ref("workspace", "w1"), directOwnerUserId: userA },
      { ref: ref("project", "p1"), parentResources: [ref("workspace", "w1")] },
    ]);
    expect(resolveResourceOwner(ref("project", "p1"), graph))
      .toEqual({ status: "RESOLVED", ownerUserId: userA });
  });

  it("rejects conflicting direct and inherited owners", () => {
    const graph = graphOf([
      { ref: ref("workspace", "w1"), directOwnerUserId: userA },
      { ref: ref("project", "p1"), directOwnerUserId: userB, parentResources: [ref("workspace", "w1")] },
    ]);
    expect(resolveResourceOwner(ref("project", "p1"), graph))
      .toEqual({ status: "OWNERSHIP_INCONSISTENT" });
  });

  it("rejects multiple parent paths with different owners", () => {
    const graph = graphOf([
      { ref: ref("workspace", "w1"), directOwnerUserId: userA },
      { ref: ref("workspace", "w2"), directOwnerUserId: userB },
      { ref: ref("schedule", "s1"), parentResources: [ref("workspace", "w1"), ref("workspace", "w2")] },
    ]);
    expect(resolveResourceOwner(ref("schedule", "s1"), graph))
      .toEqual({ status: "OWNERSHIP_INCONSISTENT" });
  });

  it("fails closed for missing parent and ownerless resources", () => {
    const graph = graphOf([
      { ref: ref("project", "p1"), parentResources: [ref("workspace", "missing")] },
      { ref: ref("resource", "r1") },
    ]);
    expect(resolveResourceOwner(ref("project", "p1"), graph)).toEqual({ status: "RESOURCE_NOT_FOUND" });
    expect(resolveResourceOwner(ref("resource", "r1"), graph)).toEqual({ status: "OWNERSHIP_UNRESOLVED" });
  });

  it("rejects ownership cycles", () => {
    const graph = graphOf([
      { ref: ref("a", "1"), parentResources: [ref("b", "1")] },
      { ref: ref("b", "1"), parentResources: [ref("a", "1")] },
    ]);
    expect(resolveResourceOwner(ref("a", "1"), graph)).toEqual({ status: "OWNERSHIP_INCONSISTENT" });
  });
});
