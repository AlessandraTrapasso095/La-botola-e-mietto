"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { accountNavigation, accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { cn } from "@/lib/cn";

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, signOut, user } = useAccount();

  useEffect(() => {
    if (hydrated && !user) router.replace(accountRoutes.signIn);
  }, [hydrated, router, user]);

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

  const logout = () => {
    signOut();
    router.push(accountRoutes.signIn);
  };

  return (
    <main id="main-content" className="min-h-[70vh]">
      <Container className="py-10 sm:py-14 lg:py-20">
        <div className="border-border-subtle mb-8 border-b pb-7 lg:hidden">
          <label className="grid gap-2" htmlFor="account-mobile-navigation">
            <span className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Area personale
            </span>
            <select
              id="account-mobile-navigation"
              value={pathname}
              onChange={(event) => router.push(event.target.value)}
              className="border-border-subtle bg-surface min-h-12 w-full border px-4"
            >
              {accountNavigation.map((link) => (
                <option key={link.href} value={link.href}>
                  {link.label}
                </option>
              ))}
            </select>
          </label>
          <Button variant="quiet" fullWidth className="mt-3" onClick={logout}>
            Esci
          </Button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
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
