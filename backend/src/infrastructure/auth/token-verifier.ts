
import type { AuthenticatedUserContext } from "../../modules/auth/auth.types.ts";

export interface TokenVerifier {
  verifyToken(token: string): Promise<AuthenticatedUserContext | null>;
}

export interface TokenVerifierOptions {
  supabaseUrl?: string;
  supabaseKey?: string;
  devMode?: boolean;
}

export class SupabaseOrDevTokenVerifier implements TokenVerifier {
  private readonly options: TokenVerifierOptions;

  constructor(options: TokenVerifierOptions) {
    this.options = options;
  }

  async verifyToken(
    token: string
  ): Promise<AuthenticatedUserContext | null> {
    const cleanToken = token.trim();

    if (!cleanToken) return null;

    const isDevToken =
      cleanToken.startsWith("dev:") ||
      cleanToken.startsWith("dev-token:") ||
      cleanToken.startsWith("mock-token:");

    // Development tokens are accepted only when explicitly enabled.
    if (isDevToken) {
      if (this.options.devMode !== true) return null;

      return this.parseDevToken(cleanToken);
    }

    // Supabase access tokens must always be verified with Supabase,
    // including when the application is running in development mode.
    if (!this.options.supabaseUrl || !this.options.supabaseKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.options.supabaseUrl}/auth/v1/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            apikey: this.options.supabaseKey
          }
        }
      );

      if (!response.ok) return null;

      const data = (await response.json()) as {
        id?: string;
        email?: string;
      };

      if (!data?.id) return null;

      return {
        userId: data.id,
        email: data.email ?? null,
        isAuthenticated: true
      };
    } catch {
      return null;
    }
  }

  private parseDevToken(
    token: string
  ): AuthenticatedUserContext | null {
    // Format: dev-token:<userId>:<email>
    if (token.startsWith("dev-token:")) {
      const parts = token.slice("dev-token:".length).split(":");
      const userId = parts[0]?.trim();
      const email = parts[1]?.trim();

      if (!userId) return null;

      return {
        userId,
        email: email || `${userId}@example.com`,
        isAuthenticated: true
      };
    }

    // Format: mock-token:<userId>
    if (token.startsWith("mock-token:")) {
      const userId = token.slice("mock-token:".length).trim();

      if (!userId) return null;

      return {
        userId,
        email: `${userId}@example.com`,
        isAuthenticated: true
      };
    }

    // Format: dev:<userId>
    if (token.startsWith("dev:")) {
      const userId = token.slice("dev:".length).trim();

      if (!userId) return null;

      return {
        userId,
        email: `${userId}@example.com`,
        isAuthenticated: true
      };
    }

    return null;
  }
}

export function createTokenVerifier(
  options: TokenVerifierOptions
): TokenVerifier {
  return new SupabaseOrDevTokenVerifier(options);
}
