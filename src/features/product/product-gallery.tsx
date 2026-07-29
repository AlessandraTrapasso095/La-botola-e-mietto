"use client";

import Image from "next/image";
import { useState } from "react";

import { SearchIcon } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import type { DemoMediaAsset } from "@/content/demo-assets/media";
import { cn } from "@/lib/cn";

export function ProductGallery({
  media,
  productName,
}: {
  media: readonly [DemoMediaAsset, ...DemoMediaAsset[]];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const activeMedia = media[activeIndex] ?? media[0];

  return (
    <>
      <div className="grid gap-3 md:grid-cols-[5.25rem_minmax(0,1fr)] md:items-start">
        <div className="scrollbar-hidden order-2 flex gap-3 overflow-x-auto md:order-1 md:grid md:overflow-visible">
          {media.map((asset, index) => (
            <button
              key={`${asset.src}-${index}`}
              type="button"
              aria-label={`Mostra immagine ${index + 1} di ${productName}`}
              aria-pressed={index === activeIndex}
              className="product-packshot-frame border-border-subtle aria-pressed:border-accent relative aspect-[3/4] w-20 shrink-0 overflow-hidden border transition-colors md:w-full"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={asset.thumbnailSrc ?? asset.src}
                alt=""
                fill
                sizes="84px"
                className="product-packshot p-2"
                style={{ objectPosition: asset.position }}
              />
            </button>
          ))}
        </div>
        <div className="image-hover product-packshot-frame border-border-subtle group relative order-1 aspect-[4/5] overflow-hidden border md:order-2">
          <Image
            src={activeMedia.src}
            alt={`${productName}: vista principale`}
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="product-packshot"
            style={{ objectPosition: activeMedia.position }}
          />
          <IconButton
            aria-label={`Ingrandisci immagine di ${productName}`}
            className="bg-background/80 absolute right-4 bottom-4 backdrop-blur-md"
            onClick={() => setZoomOpen(true)}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="bg-background h-[calc(100dvh-2rem)] max-h-none max-w-6xl p-3 sm:p-5">
          <DialogTitle className="sr-only">
            Immagine ingrandita di {productName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Vista ingrandita dell’immagine selezionata.
          </DialogDescription>
          <div className="relative h-full min-h-0">
            <Image
              src={activeMedia.src}
              alt={`${productName}: vista ingrandita`}
              fill
              sizes="100vw"
              className={cn("object-contain")}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
