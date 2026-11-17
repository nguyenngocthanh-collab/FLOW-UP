import { parseUserId } from "./identity.types";
import type { OwnershipGraphReader, OwnershipValidationResult, ResourceReference } from "./ownership.types";
import { resolveResourceOwner } from "./ownership.resolver";

export function validateResourceOwnership(
  callerUserId: unknown,
  resource: ResourceReference,
  graph: OwnershipGraphReader,
): OwnershipValidationResult {
  const identity = parseUserId(callerUserId);
  if (!identity.valid) return { valid: false, code: identity.code };

  const resolution = resolveResourceOwner(resource, graph);
  if (resolution.status === "RESOURCE_NOT_FOUND") {
    // Do not reveal whether a protected resource exists to an unauthorized caller.
    return { valid: false, code: "RESOURCE_ACCESS_DENIED" };
  }
  if (resolution.status === "OWNERSHIP_UNRESOLVED") {
    return { valid: false, code: "OWNERSHIP_UNRESOLVED" };
  }
  if (resolution.status === "OWNERSHIP_INCONSISTENT") {
    return { valid: false, code: "OWNERSHIP_INCONSISTENT" };
  }
  if (resolution.ownerUserId !== identity.userId) {
    return { valid: false, code: "OWNERSHIP_MISMATCH" };
  }

  return { valid: true, ownerUserId: resolution.ownerUserId };
}

export function validateRelatedResourceOwnership(
  callerUserId: unknown,
  source: ResourceReference,
  related: ResourceReference,
  graph: OwnershipGraphReader,
): OwnershipValidationResult {
  const sourceResult = validateResourceOwnership(callerUserId, source, graph);
  if (!sourceResult.valid) return sourceResult;

  const relatedResult = validateResourceOwnership(callerUserId, related, graph);
  if (!relatedResult.valid) {
    return { valid: false, code: "RELATED_RESOURCE_ACCESS_DENIED" };
  }

  if (sourceResult.ownerUserId !== relatedResult.ownerUserId) {
    return { valid: false, code: "CROSS_SCOPE_REFERENCE_INVALID" };
  }

  return sourceResult;
}
