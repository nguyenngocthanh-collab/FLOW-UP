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

  async verifyToken(token: string): Promise<AuthenticatedUserContext | null> {
    const cleanToken = token.trim();
    if (!cleanToken) return null;

    // Check dev / mock token
    if (
      this.options.devMode ||
      cleanToken.startsWith("dev:") ||
      cleanToken.startsWith("dev-token:") ||
      cleanToken.startsWith("mock-token:")
    ) {
      return this.parseDevToken(cleanToken);
    }

    // Supabase token verification
    if (this.options.supabaseUrl && this.options.supabaseKey) {
      try {
        const response = await fetch(`${this.options.supabaseUrl}/auth/v1/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            apikey: this.options.supabaseKey
          }
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { id: string; email?: string };
        if (!data || !data.id) return null;

        return {
          userId: data.id,
          email: data.email ?? null,
          isAuthenticated: true
        };
      } catch {
        return null;
      }
    }

    // If devMode is explicitly enabled as fallback
    if (this.options.devMode) {
      return this.parseDevToken(cleanToken);
    }

    return null;
  }

  private parseDevToken(token: string): AuthenticatedUserContext | null {
    // Formats:
    // "dev:<userId>"
    // "dev-token:<userId>:<email>"
    // "mock-token:<userId>"
    // or any string when devMode is true
    if (token.startsWith("dev-token:")) {
      const parts = token.slice("dev-token:".length).split(":");
      const userId = parts[0]?.trim();
      const email = parts[1]?.trim() || `${userId}@example.com`;
      if (!userId) return null;
      return { userId, email, isAuthenticated: true };
    }

    if (token.startsWith("mock-token:")) {
      const userId = token.slice("mock-token:".length).trim();
      if (!userId) return null;
      return { userId, email: `${userId}@example.com`, isAuthenticated: true };
    }

    if (token.startsWith("dev:")) {
      const userId = token.slice("dev:".length).trim();
      if (!userId) return null;
      return { userId, email: `${userId}@example.com`, isAuthenticated: true };
    }

    if (this.options.devMode && token.trim().length > 0) {
      const userId = token.trim();
      return { userId, email: `${userId}@example.com`, isAuthenticated: true };
    }

    return null;
  }
}

export function createTokenVerifier(options: TokenVerifierOptions): TokenVerifier {
  return new SupabaseOrDevTokenVerifier(options);
}
