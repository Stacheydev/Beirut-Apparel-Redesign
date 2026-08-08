"use client";

import { useState } from "react";
import { Check, Heart, Ruler } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SizeGuide } from "@/components/product/SizeGuide";
import { useCart, useWishlist } from "@/lib/store-context";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/catalog";

interface ProductBuyBoxProps {
  product: Product;
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [size, setSize] = useState<string | null>(
    product.variants.find((v) => v.availableForSale)?.size ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const saved = wishlist.includes(product.handle);
  const sizes = product.variants;
  const selected = sizes.find((v) => v.size === size);
  const inStock = product.availableForSale;
  const selectedAvailable = selected?.availableForSale ?? true;

  const handleAdd = () => {
    if (!inStock || !selectedAvailable) return;
    addToCart(product, { size: size ?? undefined, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <p className="eyebrow mb-2 text-muted">{product.category}</p>
      <h1 className="display text-3xl text-balance text-ink sm:text-4xl">
        {product.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Price
          priceCents={product.price.amount}
          compareAtCents={product.compareAtPrice?.amount}
          size="lg"
        />
        {product.material && (
          <span className="border border-line bg-surface px-2.5 py-1 font-sans text-[11px] uppercase tracking-[0.12em] text-muted">
            {product.material}
          </span>
        )}
      </div>

      {product.description && (
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          {product.description}
        </p>
      )}

      {/* Size selection */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
            Size
          </span>
          <button
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-lagoon hover:text-lagoon-deep"
          >
            <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} />
            Size guide
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {sizes.map((v) => {
            const active = size === v.size;
            const disabled = !v.availableForSale;
            return (
              <button
                key={v.id}
                onClick={() => !disabled && setSize(v.size)}
                disabled={disabled}
                aria-pressed={active}
                className={cn(
                  "relative border px-3 py-3 font-sans text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : disabled
                      ? "cursor-not-allowed border-line text-muted/50 line-through"
                      : "border-line text-ink hover:border-ink",
                )}
              >
                {v.size}
                {disabled && (
                  <span className="absolute right-1 top-1 text-[9px] uppercase tracking-wide text-terracotta">
                    ·
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selected && !selected.availableForSale && (
          <p className="mt-2 font-sans text-[12px] text-terracotta">
            {size} is currently unavailable — choose another size.
          </p>
        )}
      </div>

      {/* Quantity + add */}
      <div className="mt-6 flex gap-3">
        <div className="flex items-center border border-line">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-3 py-3 text-muted hover:text-ink"
          >
            −
          </button>
          <span className="min-w-8 text-center font-sans text-[14px]">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="px-3 py-3 text-muted hover:text-ink"
          >
            +
          </button>
        </div>
        <Button
          variant="lagoon"
          size="lg"
          className="flex-1"
          onClick={handleAdd}
          disabled={!inStock || !selectedAvailable}
        >
          {!inStock ? (
            "Sold out"
          ) : added ? (
            <>
              <Check className="h-4 w-4" /> Added to bag
            </>
          ) : (
            "Add to bag"
          )}
        </Button>
        <button
          onClick={() => toggleWishlist(product.handle)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "flex h-12 w-12 items-center justify-center border border-line transition-colors",
            saved ? "border-ink bg-ink text-paper" : "text-ink hover:border-ink",
          )}
        >
          <Heart className="h-5 w-5" strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {product.compareAtPrice && <Badge tone="sale">Special price</Badge>}
        {product.tags.includes("new") && <Badge tone="new">New</Badge>}
      </div>

      {/* Trust line */}
      <div className="mt-6 border-t border-line pt-4">
        <p className="font-sans text-[12px] leading-relaxed text-muted">
          Exchanges within 7 days of receiving your order · unused, unworn,
          tags attached. Refunds not available.
        </p>
      </div>

      <SizeGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        sizeOptions={sizes.map((v) => v.size)}
      />
    </div>
  );
}
