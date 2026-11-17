import { describe, expect, it, vi } from "vitest";
import { createAuthenticationService } from "../../src/modules/auth/auth.service";
import type { AuthProvider } from "../../src/modules/auth/auth.provider";

function makeProvider(): AuthProvider {
  return {
    register: vi.fn(async () => ({
      data: {
        user: { id: "user-123", email: "person@example.com" },
        session: null
      },
      error: null
    })),
    signIn: vi.fn(async () => ({
      data: {
        user: { id: "user-123", email: "person@example.com" },
        session: { user: { id: "user-123", email: "person@example.com" } }
      },
      error: null
    })),
    signOut: vi.fn(async () => ({ data: null, error: null })),
    getSession: vi.fn(async () => ({
      data: {
        session: { user: { id: "user-123", email: "person@example.com" } }
      },
      error: null
    })),
    onAuthStateChange: vi.fn(() => () => undefined)
  };
}

describe("B01 authentication service", () => {
  it("returns confirmation_required if registration has no session", async () => {
    const service = createAuthenticationService(makeProvider());
    const result = await service.register({
      email: "person@example.com",
      password: "password123"
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("confirmation_required");
    }
  });

  it("returns provider-independent User Context after sign-in", async () => {
    const service = createAuthenticationService(makeProvider());
    const result = await service.signIn({
      email: "person@example.com",
      password: "password123"
    });

    expect(result).toEqual({
      success: true,
      data: {
        userId: "user-123",
        email: "person@example.com",
        isAuthenticated: true
      }
    });
  });

  it("rejects invalid input before calling provider", async () => {
    const provider = makeProvider();
    const service = createAuthenticationService(provider);
    const result = await service.signIn({
      email: "invalid",
      password: "password123"
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "AUTH_INVALID_INPUT" }
    });
    expect(provider.signIn).not.toHaveBeenCalled();
  });
});
