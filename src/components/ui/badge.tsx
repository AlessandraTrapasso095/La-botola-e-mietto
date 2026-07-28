import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: "accent" | "neutral" | "danger";
};

const variantClasses = {
  accent: "border-accent/60 text-accent-soft",
  neutral: "border-border-subtle text-text-muted",
  danger: "border-danger/60 text-danger",
} as const;

export function Badge({ className, variant = "accent", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-pill inline-flex min-h-7 items-center border px-3 py-1 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
