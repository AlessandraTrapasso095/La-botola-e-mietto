import type { AuthService } from "@/services/auth/auth-service";
import { DemoAuthService } from "@/services/auth/demo-auth-service";
import { SupabaseAuthService } from "@/services/auth/supabase-auth-service";
import type { AuthMode } from "@/services/auth/auth-mode";

const services: Partial<Record<AuthMode, AuthService>> = {};

export function getBrowserAuthService(mode: AuthMode) {
  if (services[mode]) return services[mode];
  const service =
    mode === "supabase" ? new SupabaseAuthService() : new DemoAuthService();
  services[mode] = service;
  return service;
}
