import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function VisuallyHidden({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0,0,0,0)]",
        className,
      )}
      {...props}
    />
  );
}
