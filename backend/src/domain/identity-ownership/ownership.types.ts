import type { UserId } from "./identity.types";

/** Resource identity is independent of database and transport identifiers. */
export interface ResourceReference {
  readonly resourceType: string;
  readonly resourceId: string;
}

/**
 * Authoritative ownership graph node supplied by the owning module/repository.
 * A node may have direct ownership, inherited ownership, or both.
 * When both exist, every applicable path must resolve to the same user.
 *
 * parentResources may contain multiple references. This deliberately avoids
 * deciding the still-open Action and Schedule relationship cardinalities.
 */
export interface OwnershipNode {
  readonly ref: ResourceReference;
  readonly directOwnerUserId?: UserId | null;
  readonly parentResources?: readonly ResourceReference[];
}

export interface OwnershipGraphReader {
  getOwnershipNode(ref: ResourceReference): OwnershipNode | undefined;
}

export type OwnershipResolutionStatus =
  | "RESOLVED"
  | "RESOURCE_NOT_FOUND"
  | "OWNERSHIP_UNRESOLVED"
  | "OWNERSHIP_INCONSISTENT";

export type OwnershipResolution =
  | { status: "RESOLVED"; ownerUserId: UserId }
  | { status: Exclude<OwnershipResolutionStatus, "RESOLVED"> };

export type OwnershipErrorCode =
  | "OWNERSHIP_REQUIRED"
  | "OWNERSHIP_UNRESOLVED"
  | "OWNERSHIP_INCONSISTENT"
  | "OWNERSHIP_MISMATCH"
  | "OWNERSHIP_MODIFICATION_FORBIDDEN"
  | "RESOURCE_ACCESS_DENIED"
  | "RELATED_RESOURCE_ACCESS_DENIED"
  | "CROSS_SCOPE_REFERENCE_INVALID"
  | "OWNERSHIP_VALIDATION_FAILED";

export type OwnershipOperation = "READ" | "UPDATE" | "DELETE" | "ASSOCIATE";

export type OwnershipValidationResult =
  | { valid: true; ownerUserId: UserId }
  | { valid: false; code: OwnershipErrorCode };

export type AccessDecision =
  | { allowed: true; ownerUserId: UserId }
  | { allowed: false; code: OwnershipErrorCode };
