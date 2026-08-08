"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { useWishlist } from "@/lib/store-context";
import { discountPercent } from "@/lib/format";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/cn";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

/**
 * Fashion product card — lets the photography breathe. Second photo reveals
 * on hover; badges stay minimal; nothing crowds the image.
 */
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useWishlist();
  const saved = wishlist.includes(product.handle);
  const pct = discountPercent(product.price.amount, product.compareAtPrice?.amount);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product/${product.handle}`}
        className="relative block"
        aria-label={product.title}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-sand">
          <ProductImage
            src={product.images[0]?.url ?? "/placeholder-product.svg"}
            alt={product.title}
            hoverSrc={product.images[1]?.url}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {!product.availableForSale && <Badge tone="sold">Sold out</Badge>}
            {product.availableForSale && product.compareAtPrice && pct != null && (
              <Badge tone="sale">−{pct}%</Badge>
            )}
            {product.availableForSale && product.tags.includes("new") && (
              <Badge tone="new">New</Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product.handle)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/90 text-ink backdrop-blur-sm transition-all hover:border-ink",
          saved && "bg-ink text-paper",
        )}
      >
        <Heart
          className="h-4 w-4"
          strokeWidth={1.5}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      <div className="mt-3 flex flex-col gap-0.5">
        {product.colorFamily && (
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted">
            {product.colorFamily}
          </p>
        )}
        <Link
          href={`/product/${product.handle}`}
          className="font-sans text-[14px] font-medium leading-snug text-ink hover:text-lagoon"
        >
          {product.title}
        </Link>
        <Price
          priceCents={product.price.amount}
          compareAtCents={product.compareAtPrice?.amount}
          size="sm"
          className="mt-0.5"
        />
      </div>
    </article>
  );
}
