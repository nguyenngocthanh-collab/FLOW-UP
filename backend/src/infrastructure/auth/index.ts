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

export function createAuthProvider(config: AuthConfig): AuthProvider {
  if (config.supabaseUrl && config.supabaseAnonKey) {
    try {
      return createSupabaseAuthProvider(config.supabaseUrl, config.supabaseAnonKey);
    } catch {
      // Fallback to local dev provider if Supabase client init fails
      return createLocalDevAuthProvider();
    }
  }

  return createLocalDevAuthProvider();
}
