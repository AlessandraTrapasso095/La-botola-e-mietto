import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { children, className, error, hint, id, label, ...props },
    ref,
  ) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="grid gap-2">
        <label
          className="text-text-muted text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
          htmlFor={id}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          aria-describedby={
            [hintId, errorId].filter(Boolean).join(" ") || undefined
          }
          aria-invalid={Boolean(error)}
          className={cn(
            "border-border-subtle bg-surface text-text focus:border-accent min-h-12 w-full appearance-none rounded-xs border px-4 py-3 transition-colors duration-[var(--motion-fast)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]",
            error && "border-danger",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {hint ? (
          <p id={hintId} className="text-text-muted text-sm">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-danger text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
