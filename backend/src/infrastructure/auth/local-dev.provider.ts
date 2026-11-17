import { randomUUID } from "node:crypto";
import type {
  AuthProvider,
  ProviderAuthEvent,
  ProviderResult,
  ProviderSession,
  ProviderUser
} from "../../modules/auth/auth.provider.ts";

interface StoredDevUser {
  id: string;
  email: string;
  passwordHash: string;
}

/**
 * Local development authentication provider.
 * Implements the AuthProvider contract without requiring external Supabase credentials.
 * Automatically active when SUPABASE_URL / keys are not configured.
 */
export class LocalDevAuthProvider implements AuthProvider {
  private readonly users = new Map<string, StoredDevUser>();
  private currentSession: ProviderSession | null = null;
  private readonly listeners = new Set<
    (event: ProviderAuthEvent, session: ProviderSession | null) => void
  >();

  async register(
    email: string,
    password: string
  ): Promise<ProviderResult<{ user: ProviderUser | null; session: ProviderSession | null }>> {
    const normalizedEmail = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email === normalizedEmail) {
        return {
          data: { user: null, session: null },
          error: new Error("User already exists")
        };
      }
    }

    const id = `dev-user-${randomUUID()}`;
    const user: StoredDevUser = {
      id,
      email: normalizedEmail,
      passwordHash: password
    };
    this.users.set(id, user);

    const providerUser: ProviderUser = { id, email: normalizedEmail };
    const session: ProviderSession = { user: providerUser };
    this.currentSession = session;

    this.notify("SIGNED_IN", session);

    return {
      data: { user: providerUser, session },
      error: null
    };
  }

  async signIn(
    email: string,
    password: string
  ): Promise<ProviderResult<{ user: ProviderUser | null; session: ProviderSession | null }>> {
    const normalizedEmail = email.toLowerCase().trim();
    let found: StoredDevUser | null = null;
    for (const u of this.users.values()) {
      if (u.email === normalizedEmail && u.passwordHash === password) {
        found = u;
        break;
      }
    }

    if (!found) {
      return {
        data: { user: null, session: null },
        error: new Error("Invalid credentials")
      };
    }

    const providerUser: ProviderUser = { id: found.id, email: found.email };
    const session: ProviderSession = { user: providerUser };
    this.currentSession = session;

    this.notify("SIGNED_IN", session);

    return {
      data: { user: providerUser, session },
      error: null
    };
  }

  async signOut(): Promise<ProviderResult<null>> {
    this.currentSession = null;
    this.notify("SIGNED_OUT", null);
    return { data: null, error: null };
  }

  async getSession(): Promise<ProviderResult<{ session: ProviderSession | null }>> {
    return {
      data: { session: this.currentSession },
      error: null
    };
  }

  onAuthStateChange(
    callback: (event: ProviderAuthEvent, session: ProviderSession | null) => void
  ): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(event: ProviderAuthEvent, session: ProviderSession | null) {
    for (const listener of this.listeners) {
      try {
        listener(event, session);
      } catch {
        // ignore callback error
      }
    }
  }
}

export function createLocalDevAuthProvider(): AuthProvider {
  return new LocalDevAuthProvider();
}
