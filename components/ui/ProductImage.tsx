"use client";

import { useEffect, useRef, useState } from "react";
import { shopifyImg, webpSrcSet, fallbackSrcSet, DEFAULT_SIZES } from "@/lib/image";
import { cn } from "@/lib/cn";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Optional second image revealed on hover (fashion card standard). */
  hoverSrc?: string;
  /** Mark as above-the-fold for eager loading. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Product photography wrapper using Shopify CDN's native WebP resize.
 * No Next.js optimizer needed — the CDN serves responsive, optimized
 * images at request time. Hover image is deferred until main loads,
 * and only rendered on hover-capable devices.
 */
export function ProductImage({
  src,
  alt,
  hoverSrc,
  priority,
  sizes = DEFAULT_SIZES,
  className,
}: ProductImageProps) {
  const [hoverReady, setHoverReady] = useState(false);
  const [errored, setErrored] = useState(false);
  const mainRef = useRef<HTMLImageElement>(null);

  // Once main image is loaded AND device supports hover → unlock hover image.
  useEffect(() => {
    if (!hoverSrc || hoverSrc === src) return;
    const img = mainRef.current;
    if (img && img.complete) {
      // Already loaded (cached)
      setHoverReady(true);
      return;
    }
    // Otherwise wait for onLoad via the img element
    // (handled in the onLoad callback below)
  }, [hoverSrc, src]);

  const showHover = hoverReady && hoverSrc && hoverSrc !== src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sand",
        className,
      )}
    >
      <picture>
        <source type="image/webp" srcSet={webpSrcSet(src)} sizes={sizes} />
        <img
          ref={mainRef}
          src={shopifyImg(src, 1080)}
          srcSet={fallbackSrcSet(src)}
          sizes={sizes}
          alt={errored ? `${alt} — image unavailable` : alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => {
            if (!errored) setErrored(true);
          }}
          onLoad={() => setHoverReady(true)}
          draggable={false}
        />
      </picture>

      {showHover && (
        <picture
          className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out hover:opacity-100 pointer-events-none group-hover:opacity-100"
        >
          <source type="image/webp" srcSet={webpSrcSet(hoverSrc)} sizes={sizes} />
          <img
            src={shopifyImg(hoverSrc, 1080)}
            srcSet={fallbackSrcSet(hoverSrc)}
            sizes={sizes}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </picture>
      )}
    </div>
  );
}
