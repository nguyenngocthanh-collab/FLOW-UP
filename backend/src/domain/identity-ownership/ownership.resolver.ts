import { parseUserId, type UserId } from "./identity.types";
import type {
  OwnershipGraphReader,
  OwnershipNode,
  OwnershipResolution,
  ResourceReference,
} from "./ownership.types";

/**
 * Resolves all authoritative ownership paths. No parent means unresolved
 * unless a direct owner is present. Cycles and conflicting owners fail closed.
 */
export function resolveResourceOwner(
  ref: ResourceReference,
  graph: OwnershipGraphReader,
): OwnershipResolution {
  const visiting = new Set<string>();

  const visit = (currentRef: ResourceReference): OwnershipResolution => {
    const key = `${currentRef.resourceType}:${currentRef.resourceId}`;
    if (visiting.has(key)) return { status: "OWNERSHIP_INCONSISTENT" };

    const node: OwnershipNode | undefined = graph.getOwnershipNode(currentRef);
    if (!node) return { status: "RESOURCE_NOT_FOUND" };

    visiting.add(key);
    const resolvedOwners: UserId[] = [];

    if (node.directOwnerUserId !== undefined && node.directOwnerUserId !== null) {
      const directOwner = parseUserId(node.directOwnerUserId);
      if (!directOwner.valid) {
        visiting.delete(key);
        return { status: "OWNERSHIP_UNRESOLVED" };
      }
      resolvedOwners.push(directOwner.userId);
    }

    const parents = node.parentResources ?? [];
    for (const parentRef of parents) {
      const parentResult = visit(parentRef);
      if (parentResult.status !== "RESOLVED") {
        visiting.delete(key);
        return parentResult;
      }
      resolvedOwners.push(parentResult.ownerUserId);
    }

    visiting.delete(key);

    if (resolvedOwners.length === 0) {
      return { status: "OWNERSHIP_UNRESOLVED" };
    }

    const firstOwner = resolvedOwners[0];
    if (resolvedOwners.some((owner) => owner !== firstOwner)) {
      return { status: "OWNERSHIP_INCONSISTENT" };
    }

    return { status: "RESOLVED", ownerUserId: firstOwner };
  };

  return visit(ref);
}
