import { parseUserId } from "./identity.types";
import type {
  AccessDecision,
  OwnershipGraphReader,
  OwnershipOperation,
  ResourceReference,
} from "./ownership.types";
import { resolveResourceOwner } from "./ownership.resolver";

/**
 * C01 returns the ownership decision only. The Application Layer remains
 * responsible for enforcing it in request handling.
 */
export function checkResourceOwnershipAccess(
  callerUserId: unknown,
  resource: ResourceReference,
  _operation: OwnershipOperation,
  graph: OwnershipGraphReader,
): AccessDecision {
  const identity = parseUserId(callerUserId);
  if (!identity.valid) return { allowed: false, code: "RESOURCE_ACCESS_DENIED" };

  const resolution = resolveResourceOwner(resource, graph);
  if (resolution.status !== "RESOLVED") {
    return {
      allowed: false,
      code: resolution.status === "OWNERSHIP_INCONSISTENT"
        ? "OWNERSHIP_INCONSISTENT"
        : "RESOURCE_ACCESS_DENIED",
    };
  }

  if (resolution.ownerUserId !== identity.userId) {
    return { allowed: false, code: "RESOURCE_ACCESS_DENIED" };
  }

  return { allowed: true, ownerUserId: resolution.ownerUserId };
}

/** Ordinary updates cannot change ownership. No transfer workflow is provided. */
export function validateOwnerUnchanged(
  currentOwnerUserId: unknown,
  proposedOwnerUserId: unknown,
): { valid: true } | { valid: false; code: "OWNERSHIP_MODIFICATION_FORBIDDEN" | "OWNERSHIP_REQUIRED" } {
  const current = parseUserId(currentOwnerUserId);
  const proposed = parseUserId(proposedOwnerUserId);

  if (!current.valid || !proposed.valid) {
    return { valid: false, code: "OWNERSHIP_REQUIRED" };
  }

  return current.userId === proposed.userId
    ? { valid: true }
    : { valid: false, code: "OWNERSHIP_MODIFICATION_FORBIDDEN" };
}
