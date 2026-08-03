import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type PasswordFieldProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ className, error, hint, id, label, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;

    return (
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <label
            className="text-text-muted text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            htmlFor={id}
          >
            {label}
          </label>
          <button
            type="button"
            className="text-accent-soft min-h-8 text-xs underline-offset-4 hover:underline"
            aria-controls={id}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? "Nascondi" : "Mostra"}
          </button>
        </div>
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [hintId, errorId].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "border-border-subtle bg-surface/50 text-text focus:border-accent focus:bg-surface-elevated min-h-12 w-full rounded-xs border px-4 py-3 transition-[border-color,background-color] duration-[var(--motion-fast)]",
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
  },
);
