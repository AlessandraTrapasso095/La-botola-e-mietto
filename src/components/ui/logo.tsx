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
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-3 transition-opacity duration-[var(--motion-fast)] hover:opacity-90",
        className,
      )}
    >
      <Image
        src={brandAssets.compactLogo}
        alt=""
        width={98}
        height={60}
        priority={priority}
        className="h-9 w-auto shrink-0"
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
