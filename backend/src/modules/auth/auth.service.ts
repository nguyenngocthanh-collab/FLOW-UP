import type { AuthProvider } from "./auth.provider";
import { createAuthError, normalizeProviderError } from "./auth.errors";
import type {
  AuthenticationService,
  AuthenticationState,
  AuthenticatedUserContext,
  OperationResult,
  RegistrationResult,
  RegisterInput,
  SignInInput
} from "./auth.types";
import { validateRegisterInput, validateSignInInput } from "./auth.validation";

function toUserContext(user: { id: string; email: string | null }): AuthenticatedUserContext {
  return {
    userId: user.id,
    email: user.email,
    isAuthenticated: true
  };
}

function success<T>(data: T): OperationResult<T> {
  return { success: true, data };
}

function failure<T>(
  code: Parameters<typeof createAuthError>[0]
): OperationResult<T> {
  return { success: false, error: createAuthError(code) };
}

export function createAuthenticationService(
  provider: AuthProvider
): AuthenticationService {
  return {
    async register(input: RegisterInput): Promise<OperationResult<RegistrationResult>> {
      if (!validateRegisterInput(input).valid) {
        return failure("AUTH_INVALID_INPUT");
      }

      try {
        const result = await provider.register(input.email.trim(), input.password);
        if (result.error) {
          return { success: false, error: normalizeProviderError(result.error) };
        }

        if (result.data.session && result.data.user) {
          return success({
            status: "authenticated",
            user: toUserContext(result.data.user)
          });
        }

        return success({
          status: "confirmation_required",
          email: input.email.trim()
        });
      } catch (error) {
        return { success: false, error: normalizeProviderError(error) };
      }
    },

    async signIn(input: SignInInput): Promise<OperationResult<AuthenticatedUserContext>> {
      if (!validateSignInInput(input).valid) {
        return failure("AUTH_INVALID_INPUT");
      }

      try {
        const result = await provider.signIn(input.email.trim(), input.password);
        if (result.error) {
          return { success: false, error: normalizeProviderError(result.error) };
        }

        if (!result.data.session || !result.data.user) {
          return failure("AUTH_INVALID_CREDENTIALS");
        }

        return success(toUserContext(result.data.user));
      } catch (error) {
        return { success: false, error: normalizeProviderError(error) };
      }
    },

    async signOut(): Promise<OperationResult<void>> {
      try {
        const result = await provider.signOut();
        if (result.error) {
          return { success: false, error: normalizeProviderError(result.error) };
        }
        return success(undefined);
      } catch (error) {
        return { success: false, error: normalizeProviderError(error) };
      }
    },

    async getAuthenticationState(): Promise<AuthenticationState> {
      try {
        const result = await provider.getSession();
        if (result.error || !result.data.session) {
          return { status: "unauthenticated", user: null };
        }

        return {
          status: "authenticated",
          user: toUserContext(result.data.session.user)
        };
      } catch {
        return { status: "unauthenticated", user: null };
      }
    },

    subscribeToAuthenticationState(listener) {
      return provider.onAuthStateChange((_event, session) => {
        if (session) {
          listener({
            status: "authenticated",
            user: toUserContext(session.user)
          });
        } else {
          listener({ status: "unauthenticated", user: null });
        }
      });
    }
  };
}
