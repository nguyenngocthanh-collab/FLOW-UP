
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AuthProvider,
  ProviderAuthEvent,
  ProviderSession,
  ProviderUser
} from "./auth.provider";

function mapUser(user: {
  id: string;
  email?: string;
}): ProviderUser {
  return {
    id: user.id,
    email: user.email ?? null
  };
}

function mapSession(
  session: {
    user: {
      id: string;
      email?: string;
    };
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  } | null
): ProviderSession | null {
  if (!session) return null;

  return {
    user: mapUser(session.user),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at
  };
}

/**
 * Server-side Supabase Auth adapter.
 *
 * Each authentication operation gets its own client.
 * No shared persisted session is kept between API requests.
 */
export function createSupabaseAuthProvider(
  supabaseUrl: string,
  publishableKey: string
): AuthProvider {
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Missing Supabase public configuration.");
  }

  function createAuthClient(): SupabaseClient {
    return createClient(supabaseUrl, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
  }

  return {
    async register(email, password) {
      const client = createAuthClient();

      const { data, error } = await client.auth.signUp({
        email,
        password
      });

      return {
        data: {
          user: data.user ? mapUser(data.user) : null,
          session: mapSession(data.session)
        },
        error
      };
    },

    async signIn(email, password) {
      const client = createAuthClient();

      const { data, error } =
        await client.auth.signInWithPassword({
          email,
          password
        });

      return {
        data: {
          user: data.user ? mapUser(data.user) : null,
          session: mapSession(data.session)
        },
        error
      };
    },

    async signOut() {
      // The backend does not keep a shared Supabase session.
      // The client must discard its locally stored access token.
      return {
        data: null,
        error: null
      };
    },

    async getSession() {
      // Authentication state is verified per request by TokenVerifier.
      return {
        data: {
          session: null
        },
        error: null
      };
    },

    onAuthStateChange(
      _callback: (
        event: ProviderAuthEvent,
        session: ProviderSession | null
      ) => void
    ) {
      // There is no persistent server-side session to subscribe to.
      return () => {};
    }
  };
}
