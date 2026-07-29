import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Heading } from "@/components/ui/heading";
import type { CatalogCategory } from "@/content/catalog/types";

export function CategoryNavigation({
  categories,
}: {
  categories: readonly CatalogCategory[];
}) {
  return (
    <section aria-labelledby="category-navigation-title">
      <div className="max-w-2xl">
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Percorsi di selezione
        </p>
        <Heading id="category-navigation-title" className="mt-4">
          Esplora per categoria.
        </Heading>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal key={category.slug} delayStep={index % 3}>
            <Link
              href={`/categoria/${category.slug}`}
              className="image-hover border-border-subtle hover:border-accent group relative block min-h-80 overflow-hidden border transition-colors"
            >
              <Image
                src={category.media.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: category.media.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                  {category.eyebrow}
                </p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-text-strong font-serif text-2xl">
                      {category.name}
                    </h3>
                    <p className="text-text-muted mt-2 line-clamp-2 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <span className="border-border group-hover:border-accent group-hover:text-accent flex size-11 shrink-0 items-center justify-center border transition-colors">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
