import type { RegisterInput, SignInInput } from "./auth.types";

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<"email" | "password", string>>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput(input: RegisterInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};
  const email = input.email.trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!input.password || input.password.trim().length === 0) {
    errors.password = "Mật khẩu không được để trống.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSignInInput(input: SignInInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};
  const email = input.email.trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!input.password) {
    errors.password = "Mật khẩu không được để trống.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
