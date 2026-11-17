
import {
  randomUUID,
  randomBytes,
  scrypt,
  timingSafeEqual
} from "node:crypto";

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

const PASSWORD_KEY_LENGTH = 64;

function derivePasswordHash(
  password: string,
  salt: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, PASSWORD_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey as Buffer);
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await derivePasswordHash(password, salt);

  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash || !/^[a-f0-9]+$/i.test(originalHash)) {
    return false;
  }

  const originalBuffer = Buffer.from(originalHash, "hex");

  if (originalBuffer.length !== PASSWORD_KEY_LENGTH) {
    return false;
  }

  const derivedHash = await derivePasswordHash(password, salt);

  return timingSafeEqual(originalBuffer, derivedHash);
}

export class LocalDevAuthProvider implements AuthProvider {
  private readonly users = new Map<string, StoredDevUser>();

  private currentSession: ProviderSession | null = null;

  private readonly listeners = new Set<
    (
      event: ProviderAuthEvent,
      session: ProviderSession | null
    ) => void
  >();

  async register(
    email: string,
    password: string
  ): Promise<
    ProviderResult<{
      user: ProviderUser | null;
      session: ProviderSession | null;
    }>
  > {
    const normalizedEmail = email.toLowerCase().trim();

    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return {
          data: { user: null, session: null },
          error: new Error("User already exists")
        };
      }
    }

    const id = `dev-user-${randomUUID()}`;
    const passwordHash = await hashPassword(password);

    const storedUser: StoredDevUser = {
      id,
      email: normalizedEmail,
      passwordHash
    };

    this.users.set(id, storedUser);

    const providerUser: ProviderUser = {
      id,
      email: normalizedEmail
    };

    const session: ProviderSession = {
      user: providerUser,
      accessToken: `dev:${id}:${normalizedEmail}`
    };

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
  ): Promise<
    ProviderResult<{
      user: ProviderUser | null;
      session: ProviderSession | null;
    }>
  > {
    const normalizedEmail = email.toLowerCase().trim();

    let found: StoredDevUser | null = null;

    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        found = user;
        break;
      }
    }

    if (!found || !(await verifyPassword(password, found.passwordHash))) {
      return {
        data: { user: null, session: null },
        error: new Error("Invalid credentials")
      };
    }

    const providerUser: ProviderUser = {
      id: found.id,
      email: found.email
    };

    const session: ProviderSession = {
      user: providerUser,
      accessToken: `dev:${found.id}:${found.email}`
    };

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

    return {
      data: null,
      error: null
    };
  }

  async getSession(): Promise<
    ProviderResult<{ session: ProviderSession | null }>
  > {
    return {
      data: { session: this.currentSession },
      error: null
    };
  }

  onAuthStateChange(
    callback: (
      event: ProviderAuthEvent,
      session: ProviderSession | null
    ) => void
  ): () => void {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(
    event: ProviderAuthEvent,
    session: ProviderSession | null
  ): void {
    for (const listener of this.listeners) {
      try {
        listener(event, session);
      } catch {
        // Ignore callback errors.
      }
    }
  }
}

export function createLocalDevAuthProvider(): AuthProvider {
  return new LocalDevAuthProvider();
}
