import { forwardRef } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ButtonProps, "children" | "size"> & {
  "aria-label": string;
  children: React.ReactNode;
  size?: "sm" | "md";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { className, children, size = "md", variant = "ghost", ...props },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "shrink-0 p-0",
          size === "sm" ? "size-11" : "size-12",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
