import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type SiteNoticeProps = ComponentPropsWithoutRef<"aside"> & {
  tone?: "neutral" | "accent";
};

export function SiteNotice({
  className,
  tone = "neutral",
  ...props
}: SiteNoticeProps) {
  return (
    <aside
      className={cn(
        "rounded-sm border p-5 shadow-[var(--shadow-ambient)]",
        tone === "accent"
          ? "border-accent/40 bg-surface-elevated"
          : "border-border-subtle bg-surface",
        className,
      )}
      {...props}
    />
  );
}
