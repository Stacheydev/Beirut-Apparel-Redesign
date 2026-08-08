"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store-context";
import { formatMoney } from "@/lib/format";
import { SITE } from "@/lib/catalog";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title="Your bag"
      side="right"
    >
      {cart.lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="font-display text-2xl text-ink">Your bag is empty</p>
          <p className="max-w-xs text-[14px] text-muted">
            Start with a piece from the current edit — or build a whole look.
          </p>
          <Button variant="lagoon" href="/shop" className="mt-2">
            Shop the edits
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-6">
            <ul className="divide-y divide-line">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${line.productHandle}`}
                    onClick={() => setCartOpen(false)}
                    className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-sand"
                  >
                    {line.image && (
                      <ProductImage src={line.image.url} alt={line.title} className="h-full w-full" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/product/${line.productHandle}`}
                          onClick={() => setCartOpen(false)}
                          className="font-sans text-[14px] font-medium leading-snug text-ink hover:text-lagoon"
                        >
                          {line.title}
                        </Link>
                        {line.size && (
                          <p className="mt-0.5 font-sans text-[12px] text-muted">
                            Size {line.size}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(line.id)}
                        aria-label={`Remove ${line.title}`}
                        className="p-1 text-muted transition-colors hover:text-terracotta"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-muted hover:text-ink"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="min-w-7 text-center font-sans text-[13px]">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-muted hover:text-ink"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="font-sans text-[14px] font-medium text-ink">
                        {formatMoney(line.price.amount * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-muted">
                Subtotal
              </span>
              <span className="font-display text-xl text-ink">
                {formatMoney(cart.subtotal.amount)}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-muted">
              Exchanges within 7 days · refunds not available.
            </p>
            <Button variant="lagoon" size="lg" href="/checkout" className="mt-4 w-full">
              Checkout
            </Button>
            <button
              onClick={() => setCartOpen(false)}
              className="mt-3 w-full text-center font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              Continue shopping
            </button>
            <p className="mt-4 text-center font-sans text-[11px] text-muted/70">
              {SITE.policy.title}
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
}
