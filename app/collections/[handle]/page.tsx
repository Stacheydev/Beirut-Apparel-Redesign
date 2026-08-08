import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCollection, ALL_COLLECTIONS, collectionProducts } from "@/lib/catalog";

interface PageProps {
  params: { handle: string };
}

export function generateStaticParams() {
  return ALL_COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collection = getCollection(params.handle);
  if (!collection) return {};
  const typeLabel =
    collection.type === "edit" ? "Edit" : collection.type === "sale" ? "Special Prices" : "Collection";
  return {
    title: `${collection.title} — ${typeLabel}`,
    description:
      collection.description ??
      `${collection.title} — pieces from Beirut Apparel.`,
  };
}

export default function CollectionPage({ params }: PageProps) {
  const collection = getCollection(params.handle);
  if (!collection) notFound();

  const products = collectionProducts(collection);
  const prices = products
    .map((p) => p.price.amount)
    .filter((n) => n > 0);
  const priceRange =
    prices.length > 0
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : undefined;

  const eyebrow =
    collection.type === "edit"
      ? "The Edit"
      : collection.type === "sale"
        ? "Special Prices"
        : "Collection";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.title} — Beirut Apparel`,
    description: collection.description ?? undefined,
    url: `https://beirutapparel-concept.vercel.app/collections/${collection.handle}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionHeader
        eyebrow={eyebrow}
        title={collection.title}
        description={collection.description}
        count={collection.productHandles?.length}
        priceRange={priceRange}
        crumbs={[
          { label: "Home", href: "/" },
          { label: eyebrow, href: "/shop" },
          { label: collection.title },
        ]}
      />
      <div className="shell py-10 sm:py-14">
        <CatalogView context={{ kind: "collection", handle: collection.handle }} />
      </div>
    </>
  );
}
