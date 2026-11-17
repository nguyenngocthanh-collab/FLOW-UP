export interface ProviderUser {
  id: string;
  email: string | null;
}

export interface ProviderSession {
  user: ProviderUser;
}

export type ProviderAuthEvent =
  | "INITIAL_SESSION"
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED"
  | "PASSWORD_RECOVERY"
  | "MFA_CHALLENGE_VERIFIED";

export interface ProviderResult<T> {
  data: T;
  error: unknown | null;
}

export interface AuthProvider {
  register(email: string, password: string): Promise<
    ProviderResult<{ user: ProviderUser | null; session: ProviderSession | null }>
  >;

  signIn(email: string, password: string): Promise<
    ProviderResult<{ user: ProviderUser | null; session: ProviderSession | null }>
  >;

  signOut(): Promise<ProviderResult<null>>;

  getSession(): Promise<ProviderResult<{ session: ProviderSession | null }>>;

  onAuthStateChange(
    callback: (event: ProviderAuthEvent, session: ProviderSession | null) => void
  ): () => void;
}
