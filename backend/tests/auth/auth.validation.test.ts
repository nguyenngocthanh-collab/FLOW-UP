import { describe, expect, it } from "vitest";
import {
  validateRegisterInput,
  validateSignInInput
} from "../../src/modules/auth/auth.validation";

describe("B01 input validation", () => {
  it("accepts valid registration input", () => {
    expect(validateRegisterInput({
      email: "person@example.com",
      password: "password123"
    }).valid).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(validateSignInInput({
      email: "not-an-email",
      password: "password123"
    }).valid).toBe(false);
  });

  it("rejects empty password", () => {
    expect(validateRegisterInput({
      email: "person@example.com",
      password: ""
    }).valid).toBe(false);
  });
});
