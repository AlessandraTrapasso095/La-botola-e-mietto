import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    error,
    hint,
    id,
    label,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = [describedBy, hintId, errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="grid gap-2">
      <label
        className="text-text-muted text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-describedby={descriptionIds || undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          "border-border-subtle bg-surface/50 text-text placeholder:text-text-muted focus:border-accent focus:bg-surface-elevated min-h-12 w-full rounded-xs border px-4 py-3 transition-[border-color,background-color] duration-[var(--motion-fast)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]",
          error && "border-danger",
          className,
        )}
        {...props}
      />
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
});
