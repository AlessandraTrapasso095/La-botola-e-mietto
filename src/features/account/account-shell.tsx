"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { accountNavigation, accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { cn } from "@/lib/cn";

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authMode, hydrated, signOut, user } = useAccount();

  useEffect(() => {
    if (authMode === "demo" && hydrated && !user) {
      router.replace(accountRoutes.signIn);
    }
  }, [authMode, hydrated, router, user]);

  if (!hydrated || !user) {
    return (
      <main id="main-content" className="min-h-[55vh]">
        <Container className="py-24 text-center">
          <p className="text-text-muted" role="status">
            Apertura dell’area personale…
          </p>
        </Container>
      </main>
    );
  }

  const logout = async () => {
    await signOut();
    router.refresh();
    router.replace(accountRoutes.signIn);
  };

  const activeMobileLink =
    accountNavigation.find((link) => link.href === pathname) ??
    accountNavigation[0];

  return (
    <main id="main-content" className="min-h-[70vh]">
      <Container className="min-w-0 py-8 sm:py-14 lg:py-20">
        <div className="border-border-subtle mb-8 min-w-0 border-b pb-6 lg:hidden">
          <div className="grid min-w-0 gap-2">
            <span className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Area personale
            </span>

            <details className="group relative min-w-0">
              <summary className="border-border-subtle bg-surface text-text-strong flex min-h-12 cursor-pointer list-none items-center justify-between border px-4 font-medium [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 truncate">
                  {activeMobileLink?.label ?? "Panoramica"}
                </span>

                <ChevronDownIcon className="text-text-muted ml-3 size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>

              <div className="border-border-subtle bg-surface-elevated absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 overflow-hidden border shadow-[var(--shadow-ambient)]">
                <nav aria-label="Navigazione account mobile">
                  <ul className="grid">
                    {accountNavigation.map((link) => {
                      const active = pathname === link.href;

                      return (
                        <li
                          key={link.href}
                          className="border-border-subtle border-b last:border-b-0"
                        >
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-11 items-center justify-between px-4 text-sm transition-colors",
                              active
                                ? "bg-accent/10 text-accent-soft"
                                : "text-text-muted hover:text-text-strong hover:bg-white/[0.03]",
                            )}
                          >
                            {link.label}

                            {active ? (
                              <span
                                aria-hidden="true"
                                className="bg-accent size-1.5 rounded-full"
                              />
                            ) : (
                              <ArrowRightIcon className="size-3.5 opacity-50" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </details>
          </div>

          <Button variant="quiet" fullWidth className="mt-3" onClick={logout}>
            Esci
          </Button>
        </div>

        <div className="grid min-w-0 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Area personale
              </p>
              <p className="text-text-strong mt-3 font-serif text-xl">
                {user.firstName} {user.lastName}
              </p>
              <nav aria-label="Navigazione account" className="mt-7">
                <ul className="border-border-subtle border-t">
                  {accountNavigation.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li
                        key={link.href}
                        className="border-border-subtle border-b"
                      >
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center justify-between text-sm transition-colors",
                            active
                              ? "text-accent-soft"
                              : "text-text-muted hover:text-text-strong",
                          )}
                        >
                          {link.label}
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <button
                type="button"
                className="text-text-muted hover:text-accent-soft mt-5 min-h-11 text-sm transition-colors"
                onClick={logout}
              >
                Esci
              </button>
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </main>
  );
}
