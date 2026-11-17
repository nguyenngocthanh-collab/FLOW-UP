/**
 * C01 — Application identity contracts.
 * Provider-independent. UserId is deliberately not constrained to UUID:
 * the specification does not approve a concrete identifier format.
 */
declare const userIdBrand: unique symbol;

export type UserId = string & { readonly [userIdBrand]: "UserId" };

export type IdentityErrorCode =
  | "IDENTITY_REQUIRED"
  | "IDENTITY_INVALID"
  | "IDENTITY_NOT_FOUND"
  | "IDENTITY_INACTIVE";

export type IdentityValidationResult =
  | { valid: true; userId: UserId }
  | { valid: false; code: IdentityErrorCode };

export function parseUserId(value: unknown): IdentityValidationResult {
  if (value === null || value === undefined || value === "") {
    return { valid: false, code: "IDENTITY_REQUIRED" };
  }

  if (typeof value !== "string" || value.trim().length === 0 || value !== value.trim()) {
    return { valid: false, code: "IDENTITY_INVALID" };
  }

  return { valid: true, userId: value as UserId };
}
