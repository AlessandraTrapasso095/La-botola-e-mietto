import Image from "next/image";
import Link from "next/link";

import { brandAssets } from "@/config/brand";
import { businessInfo } from "@/config/business";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  compact?: boolean;
  priority?: boolean;
  wordmarkClassName?: string;
};

export function Logo({
  className,
  compact = false,
  priority = false,
  wordmarkClassName,
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${businessInfo.brandName}, homepage`}
      className={cn("inline-flex min-h-11 items-center gap-3", className)}
    >
      <Image
        src={brandAssets.compactLogo}
        alt=""
        width={40}
        height={40}
        priority={priority}
        className="size-9"
      />
      {compact ? null : (
        <span
          className={cn(
            "text-accent-soft font-serif text-lg leading-none font-semibold",
            wordmarkClassName,
          )}
        >
          {businessInfo.brandName}
        </span>
      )}
    </Link>
  );
}
