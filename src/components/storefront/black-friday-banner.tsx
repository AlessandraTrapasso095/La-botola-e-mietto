"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BLACK_FRIDAY_END = new Date(
  "2026-11-28T00:00:00+01:00",
).getTime();

export function BlackFridayBanner() {
  const [visible, setVisible] = useState(
    () => Date.now() < BLACK_FRIDAY_END,
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    const remaining = Math.max(
      0,
      BLACK_FRIDAY_END - Date.now(),
    );

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden border-b border-orange-400/30 bg-[#120b05]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,132,0,0.12),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-2 px-4 py-3 text-center sm:min-h-[62px] sm:flex-row sm:gap-5 sm:px-6 sm:py-2 lg:gap-7 lg:px-8">
        <span className="whitespace-nowrap text-sm font-black tracking-[0.14em] text-orange-400 uppercase sm:text-base lg:text-lg">
          Black Friday
        </span>

        <span
          aria-hidden="true"
          className="hidden h-6 w-px shrink-0 bg-orange-400/30 sm:block"
        />

        <span className="max-w-full text-xs leading-snug font-medium text-white/75 sm:text-sm lg:text-[15px]">
          Offerte speciali disponibili solo per oggi
        </span>

        <Link
          href="/in-offerta"
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-orange-400/50 bg-orange-400/10 px-4 text-xs font-semibold text-orange-300 transition hover:border-orange-300 hover:bg-orange-400 hover:text-black sm:ml-1 sm:text-sm"
        >
          Scopri le offerte
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
