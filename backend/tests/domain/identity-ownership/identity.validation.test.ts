import { describe, expect, it } from "vitest";
import { parseUserId } from "../../../src/domain/identity-ownership";

describe("C01 Application User ID", () => {
  it("accepts a non-empty stable application identifier without assuming UUID format", () => {
    expect(parseUserId("user_123")).toEqual({ valid: true, userId: "user_123" });
  });

  it("rejects a missing identifier", () => {
    expect(parseUserId(undefined)).toEqual({ valid: false, code: "IDENTITY_REQUIRED" });
  });

  it("rejects malformed identifiers", () => {
    expect(parseUserId("  ")).toEqual({ valid: false, code: "IDENTITY_INVALID" });
    expect(parseUserId(123)).toEqual({ valid: false, code: "IDENTITY_INVALID" });
  });
});
