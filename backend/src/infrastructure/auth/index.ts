
import type { AuthProvider } from "../../modules/auth/auth.provider.ts";
import { createSupabaseAuthProvider } from "../../modules/auth/supabase.provider.ts";
import { createLocalDevAuthProvider } from "./local-dev.provider.ts";

export * from "./token-verifier.ts";
export * from "./local-dev.provider.ts";

export interface AuthConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  devMode?: boolean;
}

export function createAuthProvider(
  config: AuthConfig
): AuthProvider {
  const hasSupabaseConfig =
    Boolean(config.supabaseUrl?.trim()) &&
    Boolean(config.supabaseAnonKey?.trim());

  // Explicit local development mode without Supabase configuration.
  if (config.devMode === true && !hasSupabaseConfig) {
    return createLocalDevAuthProvider();
  }

  // Supabase is required when local development mode is disabled.
  if (!hasSupabaseConfig) {
    throw new Error(
      "Supabase Auth configuration is required. " +
      "Set SUPABASE_URL and SUPABASE_ANON_KEY, " +
      "or explicitly enable AUTH_DEV_MODE=true for local development."
    );
  }

  try {
    return createSupabaseAuthProvider(
      config.supabaseUrl!,
      config.supabaseAnonKey!
    );
  } catch {
    throw new Error(
      "Failed to initialize Supabase Auth provider."
    );
  }
}
