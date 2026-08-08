"use client";

import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store-context";
import { formatMoney } from "@/lib/format";

/** Lightweight checkout concept — no real payments; shows the flow. */
export default function CheckoutPage() {
  const { cart } = useCart();

  return (
    <>
      <CollectionHeader
        eyebrow="Checkout"
        title="Almost there"
        description="Order summary — this concept does not process payments."
        crumbs={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]}
      />
      <div className="shell py-12">
        <div className="mx-auto max-w-md">
          <div className="border border-line bg-surface p-6">
            <p className="eyebrow mb-4 text-muted">Your order</p>
            <ul className="space-y-3">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-4 font-sans text-[14px]">
                  <span className="text-ink">
                    {line.quantity} × {line.title}
                    {line.size ? ` (${line.size})` : ""}
                  </span>
                  <span className="text-muted">
                    {formatMoney(line.price.amount * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-muted">
                Total
              </span>
              <span className="font-display text-2xl text-ink">
                {formatMoney(cart.subtotal.amount)}
              </span>
            </div>
          </div>

          <div className="mt-6 border border-terracotta/40 bg-terracotta/5 p-6">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-terracotta">
              Concept, not commerce
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              This is an independent NorthBound redesign concept. It does not
              process payments or place real orders. In a live store this page
              would hand off to the Shopify checkout.
            </p>
          </div>

          <Button variant="ink" size="lg" href="/" className="mt-6 w-full">
            Back to the storefront
          </Button>
        </div>
      </div>
    </>
  );
}
