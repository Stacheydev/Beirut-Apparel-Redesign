"use client";

import { Check } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { getRecommendedProducts, getRecommendations } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/lib/store-context";
import type { Product } from "@/types/catalog";
import { useState } from "react";

interface CompleteTheLookProps {
  product: Product;
}

/** The brand's coordinating separates, surfaced as a styled outfit. */
export function CompleteTheLook({ product }: CompleteTheLookProps) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const recs = getRecommendations(product.handle, ["complete-the-look"]);
  const pieces = getRecommendedProducts(recs)
    .filter((p) => p.availableForSale)
    .slice(0, 3);

  if (pieces.length === 0) return null;

  const total = pieces.reduce((n, p) => n + p.price.amount, 0);

  const addAll = () => {
    for (const p of pieces) {
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
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <section className="mt-20 border-t border-line pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2 text-muted">Complete the look</p>
          <h2 className="display text-2xl sm:text-3xl">
            Pieces that go with {product.title.toLowerCase().replace(/^(the )?/, "this ")}
          </h2>
        </div>
        <Button variant="outline" size="md" onClick={addAll} disabled={added}>
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            `Add all — ${formatMoney(total)}`
          )}
        </Button>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
        {pieces.map((p) => (
          <li key={p.handle}>
            <a href={`/product/${p.handle}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                {p.images[0] && (
                  <ProductImage
                    src={p.images[0].url}
                    alt={p.title}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                )}
              </div>
              <div className="mt-3">
                {p.colorFamily && (
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted">
                    {p.colorFamily}
                  </p>
                )}
                <p className="font-sans text-[14px] font-medium leading-snug text-ink group-hover:text-lagoon">
                  {p.title}
                </p>
                <Price priceCents={p.price.amount} compareAtCents={p.compareAtPrice?.amount} size="sm" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
