"use client";

import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/lib/store-context";
import { getProducts } from "@/lib/catalog";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const products = getProducts(wishlist);

  return (
    <>
      <CollectionHeader
        eyebrow="Saved"
        title="Your wishlist"
        description={
          products.length
            ? `${products.length} ${products.length === 1 ? "piece" : "pieces"} you're saving for later.`
            : undefined
        }
        crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <div className="shell py-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-display text-2xl text-ink">Nothing saved yet</p>
            <p className="max-w-xs text-[14px] text-muted">
              Tap the heart on any piece to keep it here for later.
            </p>
            <Button variant="lagoon" href="/shop" className="mt-2">
              Browse the shop
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.handle}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
