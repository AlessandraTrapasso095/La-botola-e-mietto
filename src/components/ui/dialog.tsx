"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-text-strong font-serif text-2xl leading-[var(--line-height-heading)] font-semibold",
        className,
      )}
      {...props}
    />
  );
});

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-text-muted leading-[var(--line-height-body)]",
        className,
      )}
      {...props}
    />
  );
});

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  dismissible?: boolean;
  showClose?: boolean;
};

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  {
    children,
    className,
    dismissible = true,
    showClose = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    ...props
  },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--overlay-color)] backdrop-blur-sm data-[state=closed]:animate-[dialog-overlay-out_var(--motion-standard)_var(--ease-functional)] data-[state=open]:animate-[dialog-overlay-in_var(--motion-standard)_var(--ease-functional)]" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "border-border-subtle bg-surface-elevated fixed top-1/2 left-1/2 z-[var(--z-dialog)] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm border p-6 shadow-[var(--shadow-ambient)] data-[state=closed]:animate-[dialog-content-out_var(--motion-standard)_var(--ease-functional)] data-[state=open]:animate-[dialog-content-in_var(--motion-standard)_var(--ease-editorial)] sm:p-8",
          className,
        )}
        onEscapeKeyDown={(event) => {
          if (!dismissible) event.preventDefault();
          onEscapeKeyDown?.(event);
        }}
        onPointerDownOutside={(event) => {
          if (!dismissible) event.preventDefault();
          onPointerDownOutside?.(event);
        }}
        {...props}
      >
        {children}
        {dismissible && showClose ? (
          <DialogPrimitive.Close asChild>
            <IconButton
              aria-label="Chiudi finestra"
              size="sm"
              className="absolute top-3 right-3"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ×
              </span>
            </IconButton>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
