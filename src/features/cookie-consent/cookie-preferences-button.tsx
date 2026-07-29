"use client";

import { cn } from "@/lib/cn";

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn("animated-underline min-h-10 text-left text-sm", className)}
      onClick={() =>
        window.dispatchEvent(new Event("lbm:open-cookie-preferences"))
      }
    >
      Preferenze cookie
    </button>
  );
}
