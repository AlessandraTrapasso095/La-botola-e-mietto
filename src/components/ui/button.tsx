import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "quiet";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const variantClasses = {
  primary:
    "border-accent bg-accent text-accent-contrast hover:border-accent-soft hover:bg-accent-soft",
  secondary:
    "border-border bg-transparent text-text-strong hover:border-accent hover:text-accent-soft",
  ghost:
    "border-transparent bg-transparent text-text hover:text-accent-soft after:absolute after:inset-x-4 after:bottom-2 after:h-px after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-[var(--motion-standard)] hover:after:origin-left hover:after:scale-x-100",
  quiet:
    "border-border-subtle bg-surface text-text hover:border-accent hover:bg-surface-elevated",
} as const;

const sizeClasses = {
  sm: "min-h-11 px-4 py-2 text-xs",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-12 px-8 py-4 text-sm",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xs border font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-[color,background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-functional)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
