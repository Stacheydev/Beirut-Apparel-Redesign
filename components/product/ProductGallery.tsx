"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { ProductImage as ProductImageType } from "@/types/catalog";
import { cn } from "@/lib/cn";

interface ProductGalleryProps {
  images: ProductImageType[];
  title: string;
}

/** Editorial gallery — large stage + thumbnail strip, keyboard friendly. */
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index];

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <ProductImage
          src={current.url}
          alt={current.altText ?? title}
          className="h-full w-full"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/90 text-ink backdrop-blur-sm transition-colors hover:border-ink"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/90 text-ink backdrop-blur-sm transition-colors hover:border-ink"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <span className="absolute bottom-3 right-3 bg-ink/80 px-2.5 py-1 font-sans text-[11px] tracking-[0.1em] text-paper">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-sand transition-opacity",
                i === index ? "opacity-100 ring-1 ring-ink" : "opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={img.url} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
