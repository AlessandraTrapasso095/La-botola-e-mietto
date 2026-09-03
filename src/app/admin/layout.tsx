import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import "@/styles/globals.css";

const manrope = localFont({
  src: "../../assets/fonts/manrope-latin-variable.woff2",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Amministrazione | La Botola e Mietto",
    template: "%s | Amministrazione",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={manrope.variable}>
      <body className="min-h-screen bg-[#0d0d0d] font-sans text-white">
        {children}
      </body>
    </html>
  );
}
