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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,132,0,0.14),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">

        {/* MOBILE */}
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:hidden">
          <div className="text-[20px] font-black tracking-[0.12em] text-orange-400 uppercase">
            Black Friday
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="text-[13px] font-medium text-white/75">
              Offerte speciali solo per oggi
            </span>

            <Link
              href="/in-offerta"
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-orange-400/50 bg-orange-400/10 px-4 text-[13px] font-semibold text-orange-300 transition hover:border-orange-300 hover:bg-orange-400 hover:text-black"
            >
              Scopri le offerte
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* TABLET / DESKTOP */}
        <div className="hidden min-h-[62px] w-full items-center justify-center gap-6 text-center md:flex lg:gap-8">
          <span className="shrink-0 text-lg font-black tracking-[0.16em] text-orange-400 uppercase">
            Black Friday
          </span>

          <span
            aria-hidden="true"
            className="h-6 w-px shrink-0 bg-orange-400/30"
          />

          <span className="text-sm font-medium text-white/75 lg:text-[15px]">
            Offerte speciali disponibili solo per oggi
          </span>

          <Link
            href="/in-offerta"
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-orange-400/50 bg-orange-400/10 px-4 text-sm font-semibold text-orange-300 transition hover:border-orange-300 hover:bg-orange-400 hover:text-black"
          >
            Scopri le offerte
            <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
