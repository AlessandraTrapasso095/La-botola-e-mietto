import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type HeadingElement = "h1" | "h2" | "h3" | "h4";

type HeadingProps = ComponentPropsWithoutRef<HeadingElement> & {
  as?: HeadingElement;
  size?: "display" | "xl" | "lg" | "md" | "sm";
  tone?: "default" | "accent" | "muted";
};

const sizeClasses = {
  display:
    "text-[length:var(--font-size-display)] leading-[var(--line-height-tight)] font-semibold",
  xl: "text-3xl leading-[var(--line-height-heading)] font-semibold",
  lg: "text-2xl leading-[var(--line-height-heading)] font-semibold",
  md: "text-xl leading-[var(--line-height-heading)] font-medium",
  sm: "text-lg leading-[var(--line-height-heading)] font-medium",
} as const;

const toneClasses = {
  default: "text-text-strong",
  accent: "text-accent-soft",
  muted: "text-text-muted",
} as const;

export function Heading({
  as = "h2",
  className,
  size = "lg",
  tone = "default",
  ...props
}: HeadingProps) {
  const Component = as as ElementType;

  return (
    <Component
      className={cn(
        "font-serif text-balance",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
