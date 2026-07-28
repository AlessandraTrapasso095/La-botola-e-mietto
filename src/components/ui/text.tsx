import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type TextElement = "p" | "span" | "div";

type TextProps = ComponentPropsWithoutRef<TextElement> & {
  as?: TextElement;
  size?: "sm" | "base" | "lg";
  tone?: "default" | "muted" | "accent";
};

const sizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

const toneClasses = {
  default: "text-text",
  muted: "text-text-muted",
  accent: "text-accent-soft",
} as const;

export function Text({
  as = "p",
  className,
  size = "base",
  tone = "default",
  ...props
}: TextProps) {
  const Component = as as ElementType;

  return (
    <Component
      className={cn(
        "leading-[var(--line-height-body)]",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
