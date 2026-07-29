import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import type { CatalogBrand } from "@/content/catalog/types";

export function BrandGrid({ brands }: { brands: readonly CatalogBrand[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand, index) => (
        <Reveal key={brand.slug} delayStep={index % 3}>
          <Link
            href={`/marchio/${brand.slug}`}
            className="image-hover border-border-subtle hover:border-accent group relative block min-h-96 overflow-hidden border transition-colors"
          >
            <Image
              src={brand.media.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: brand.media.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                {brand.country}
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-text-strong font-serif text-3xl">
                    {brand.name}
                  </h2>
                  <p className="text-text-muted mt-2 line-clamp-2 text-sm">
                    {brand.description}
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
  );
}
