"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useCart } from "@/lib/store-context";
import { getProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { roleLabel } from "@/lib/looks";
import type { Look } from "@/types/catalog";
import { useState } from "react";

interface LookViewProps {
  look: Look;
}

/** A full "shop the look" composition: outfit image + orderable pieces. */
export function LookView({ look }: LookViewProps) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const products = getProducts(look.items.map((i) => i.productHandle)).filter(
    (p) => p.availableForSale,
  );

  const total = products.reduce((n, p) => n + p.price.amount, 0);

  const addAll = () => {
    for (const p of products) {
      addLine({
        productId: p.id,
        productHandle: p.handle,
        variantId: p.variants[0]?.id,
        title: p.title,
        size: p.variants[0]?.size,
        image: p.images[0],
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        quantity: 1,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  };

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs
        crumbs={[
          { label: "Looks", href: "/looks" },
          { label: look.title },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Outfit image */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <ProductImage src={look.image} alt={look.title} className="h-full w-full" priority />
          </div>
        </div>

        {/* Outfit details + pieces */}
        <div className="lg:col-span-5">
          <p className="eyebrow mb-3 text-muted">Look · {look.mood}</p>
          <h1 className="display text-4xl text-ink sm:text-5xl">{look.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {look.description}
          </p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-muted">
                Complete the look
              </span>
              <span className="font-display text-lg text-ink">{formatMoney(total)}</span>
            </div>

            <ol className="divide-y divide-line">
              {look.items.map((item, i) => {
                const p = getProducts([item.productHandle])[0];
                if (!p) return null;
                return (
                  <li key={item.productHandle} className="flex items-center gap-4 py-4">
                    <span className="font-display text-lg text-muted/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/product/${p.handle}`}
                      className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-sand"
                    >
                      {p.images[0] && (
                        <ProductImage src={p.images[0].url} alt={p.title} className="h-full w-full" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${p.handle}`}
                        className="block truncate font-sans text-[14px] font-medium text-ink hover:text-lagoon"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
                        {roleLabel(item.role)}
                        {item.note ? ` · ${item.note}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <Price priceCents={p.price.amount} compareAtCents={p.compareAtPrice?.amount} size="sm" />
                      {!p.availableForSale && (
                        <p className="font-sans text-[11px] text-terracotta">Sold out</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-6 border border-line bg-surface p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-muted">
                Entire look
              </span>
              <span className="font-display text-xl text-ink">{formatMoney(total)}</span>
            </div>
            <Button
              variant="lagoon"
              size="lg"
              className="mt-4 w-full"
              onClick={addAll}
              disabled={added}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to your bag
                </>
              ) : (
                "Add all to bag"
              )}
            </Button>
            <p className="mt-3 text-center font-sans text-[11px] text-muted">
              {products.length} in-stock pieces · exchanges within 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
