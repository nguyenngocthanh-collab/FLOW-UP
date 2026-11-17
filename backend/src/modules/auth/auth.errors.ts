import type { AuthError, AuthErrorCode } from "./auth.types";

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  AUTH_INVALID_INPUT: "Email hoặc mật khẩu không hợp lệ.",
  AUTH_INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác.",
  AUTH_EMAIL_ALREADY_EXISTS: "Email này đã được đăng ký.",
  AUTH_EMAIL_NOT_CONFIRMED: "Email chưa được xác minh.",
  AUTH_SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  AUTH_RATE_LIMITED: "Có quá nhiều yêu cầu. Vui lòng thử lại sau.",
  AUTH_NETWORK_ERROR: "Không thể kết nối mạng. Vui lòng thử lại.",
  AUTH_PROVIDER_ERROR: "Dịch vụ xác thực đang gặp sự cố.",
  AUTH_UNAUTHENTICATED: "Bạn cần đăng nhập để tiếp tục."
};

export function createAuthError(code: AuthErrorCode): AuthError {
  return { code, message: ERROR_MESSAGES[code] };
}

export function normalizeProviderError(error: unknown): AuthError {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message).toLowerCase()
      : "";

  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status: unknown }).status)
      : 0;

  if (
    message.includes("already registered") ||
    message.includes("user already exists") ||
    message.includes("already been registered")
  ) return createAuthError("AUTH_EMAIL_ALREADY_EXISTS");

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) return createAuthError("AUTH_INVALID_CREDENTIALS");

  if (
    message.includes("email not confirmed") ||
    message.includes("email_not_confirmed")
  ) return createAuthError("AUTH_EMAIL_NOT_CONFIRMED");

  if (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    status === 429
  ) return createAuthError("AUTH_RATE_LIMITED");

  if (
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("failed to fetch")
  ) return createAuthError("AUTH_NETWORK_ERROR");

  if (status === 401) return createAuthError("AUTH_INVALID_CREDENTIALS");

  return createAuthError("AUTH_PROVIDER_ERROR");
}
