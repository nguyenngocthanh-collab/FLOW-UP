import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AuthProvider,
  ProviderAuthEvent,
  ProviderSession,
  ProviderUser
} from "./auth.provider";

function mapUser(user: { id: string; email?: string }): ProviderUser {
  return { id: user.id, email: user.email ?? null };
}

function mapSession(
  session: { user: { id: string; email?: string } } | null
): ProviderSession | null {
  return session ? { user: mapUser(session.user) } : null;
}

/**
 * Browser-side Supabase Auth adapter.
 * Use only the public/publishable key, never a service-role key.
 */
export function createSupabaseAuthProvider(
  supabaseUrl: string,
  publishableKey: string
): AuthProvider {
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Missing Supabase public configuration.");
  }

  const client: SupabaseClient = createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return {
    async register(email, password) {
      const { data, error } = await client.auth.signUp({ email, password });
      return {
        data: {
          user: data.user ? mapUser(data.user) : null,
          session: mapSession(data.session)
        },
        error
      };
    },

    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      return {
        data: {
          user: data.user ? mapUser(data.user) : null,
          session: mapSession(data.session)
        },
        error
      };
    },

    async signOut() {
      const { error } = await client.auth.signOut();
      return { data: null, error };
    },

    async getSession() {
      const { data, error } = await client.auth.getSession();
      return {
        data: { session: mapSession(data.session) },
        error
      };
    },

    onAuthStateChange(callback) {
      const { data } = client.auth.onAuthStateChange((event, session) => {
        callback(event as ProviderAuthEvent, mapSession(session));
      });

      return () => data.subscription.unsubscribe();
    }
  };
}
