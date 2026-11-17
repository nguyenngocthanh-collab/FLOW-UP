export interface RegisterInput {
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthenticatedUserContext {
  userId: string;
  email: string | null;
  isAuthenticated: true;
}

export type AuthenticationState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: AuthenticatedUserContext };

export type RegistrationResult =
  | { status: "confirmation_required"; email: string }
  | { status: "authenticated"; user: AuthenticatedUserContext };

export type AuthErrorCode =
  | "AUTH_INVALID_INPUT"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_EMAIL_ALREADY_EXISTS"
  | "AUTH_EMAIL_NOT_CONFIRMED"
  | "AUTH_SESSION_EXPIRED"
  | "AUTH_RATE_LIMITED"
  | "AUTH_NETWORK_ERROR"
  | "AUTH_PROVIDER_ERROR"
  | "AUTH_UNAUTHENTICATED";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export type OperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError };

export interface AuthenticationService {
  register(input: RegisterInput): Promise<OperationResult<RegistrationResult>>;
  signIn(input: SignInInput): Promise<OperationResult<AuthenticatedUserContext>>;
  signOut(): Promise<OperationResult<void>>;
  getAuthenticationState(): Promise<AuthenticationState>;
  subscribeToAuthenticationState(
    listener: (state: AuthenticationState) => void
  ): () => void;
}
