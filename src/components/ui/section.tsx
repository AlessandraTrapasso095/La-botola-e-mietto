import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: "compact" | "standard" | "editorial";
};

const spacingClasses = {
  compact: "py-12 md:py-16",
  standard: "py-20 md:py-28",
  editorial: "py-24 md:py-40",
} as const;

export function Section({
  className,
  spacing = "standard",
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)} {...props} />
  );
}
