"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store-context";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      <CollectionHeader
        eyebrow="Your bag"
        title="Shopping bag"
        description={
          cart.lines.length
            ? `${cart.totalQuantity} ${cart.totalQuantity === 1 ? "item" : "items"} · exchanges within 7 days`
            : undefined
        }
        crumbs={[{ label: "Home", href: "/" }, { label: "Bag" }]}
      />
      <div className="shell py-12">
        {cart.lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-display text-2xl text-ink">Your bag is empty</p>
            <p className="max-w-xs text-[14px] text-muted">
              Start with a piece from the current edit — or build a whole look.
            </p>
            <Button variant="lagoon" href="/shop" className="mt-2">
              Shop the edits
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-line border-y border-line">
                {cart.lines.map((line) => (
                  <li key={line.id} className="flex gap-5 py-6">
                    <Link
                      href={`/product/${line.productHandle}`}
                      className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-sand"
                    >
                      {line.image && (
                        <ProductImage src={line.image.url} alt={line.title} className="h-full w-full" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/product/${line.productHandle}`}
                            className="font-sans text-[15px] font-medium text-ink hover:text-lagoon"
                          >
                            {line.title}
                          </Link>
                          <p className="mt-1 font-sans text-[12px] text-muted">
                            {line.size ? `Size ${line.size}` : "One size"}
                          </p>
                        </div>
                        <span className="font-sans text-[15px] font-medium text-ink">
                          {formatMoney(line.price.amount * line.quantity)}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="px-3 py-1.5 text-muted hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <span className="min-w-8 text-center font-sans text-[14px]">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="px-3 py-1.5 text-muted hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(line.id)}
                          className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-terracotta"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-line bg-surface p-6">
                <p className="eyebrow mb-4 text-muted">Summary</p>
                <div className="flex items-baseline justify-between border-b border-line pb-4">
                  <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-muted">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl text-ink">
                    {formatMoney(cart.subtotal.amount)}
                  </span>
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-muted">
                  Exchanges only, within 7 days of receiving your order. Items
                  must be unused, unworn and in original condition with tags
                  attached. Refunds are not available.
                </p>
                <Button variant="lagoon" size="lg" href="/checkout" className="mt-6 w-full">
                  Checkout
                </Button>
                <Link
                  href="/looks"
                  className="mt-3 block text-center font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-muted hover:text-ink"
                >
                  Discover a look instead
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
