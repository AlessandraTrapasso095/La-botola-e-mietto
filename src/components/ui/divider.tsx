import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Divider({
  className,
  ...props
}: ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      className={cn("border-border-subtle my-0 border-0 border-t", className)}
      {...props}
    />
  );
}
