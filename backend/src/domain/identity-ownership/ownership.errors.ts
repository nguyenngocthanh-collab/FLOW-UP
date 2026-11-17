import type { IdentityErrorCode } from "./identity.types";
import type { OwnershipErrorCode } from "./ownership.types";

export type C01ErrorCode = IdentityErrorCode | OwnershipErrorCode;

export class C01DomainError extends Error {
  readonly code: C01ErrorCode;

  constructor(code: C01ErrorCode, message: string) {
    super(message);
    this.name = "C01DomainError";
    this.code = code;
  }
}
