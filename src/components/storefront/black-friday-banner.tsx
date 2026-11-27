"use client";

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,132,0,0.16),transparent_65%)]" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-2.5 px-4 py-3.5 text-center sm:px-6 md:min-h-[68px] md:flex-row md:gap-6 md:py-2 lg:gap-8 lg:px-8">

        <span className="shrink-0 text-[20px] font-black tracking-[0.13em] text-orange-400 uppercase sm:text-[22px] md:text-xl lg:text-[22px]">
          Black Friday
        </span>

        <span
          aria-hidden="true"
          className="hidden h-7 w-px shrink-0 bg-orange-400/30 md:block"
        />

        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[13px] leading-relaxed font-medium text-white/85 sm:text-sm md:text-[15px]">
          <span>Con il codice</span>

          <span className="inline-flex items-center rounded-md border border-orange-400/70 bg-orange-400/15 px-2.5 py-1 font-black tracking-[0.08em] text-orange-300 uppercase shadow-[0_0_16px_rgba(251,146,60,0.12)]">
            BLACKFRIDAY
          </span>

          <span>
            ottieni il{" "}
            <strong className="font-black text-white">
              10% di sconto
            </strong>{" "}
            sugli ordini superiori a{" "}
            <strong className="font-black text-white">
              70 €
            </strong>
          </span>
        </div>

      </div>
    </div>
  );
}
