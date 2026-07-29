import Link from "next/link";

import { ChevronDownIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";

type Breadcrumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-border-subtle border-b">
      <Container>
        <ol className="text-text-muted flex min-h-12 items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index > 0 ? (
                <ChevronDownIcon className="size-3 -rotate-90 opacity-60" />
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-accent-soft transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-text-strong">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}
