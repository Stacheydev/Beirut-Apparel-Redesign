import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { collectionProducts, getCollection } from "@/lib/catalog";
import type { Collection } from "@/types/catalog";

interface EditOfTheSeasonProps {
  collectionHandle: string;
  index: string;
}

/** Editorial spotlight for the current collection drop. */
export function EditOfTheSeason({ collectionHandle, index }: EditOfTheSeasonProps) {
  const collection = getCollection(collectionHandle);
  if (!collection) return null;

  const products = collectionProducts(collection).filter((p) => p.availableForSale).slice(0, 4);
  const cover = collection.image ?? products[0]?.images[0]?.url;

  return (
    <section className="shell py-16 sm:py-24">
      <SectionHeading
        index={index}
        eyebrow="The edit of the season"
        title={collection.title}
        description={collection.description || undefined}
        href={`/collections/${collection.handle}`}
        linkLabel="Explore the edit"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Editorial cover */}
        <div className="relative overflow-hidden bg-sand lg:col-span-5">
          {cover && (
            <ProductImage
              src={cover}
              alt={collection.title}
              className="aspect-[4/5] h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          )}
          {collection.description && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent p-6">
              <p className="font-display text-lg italic leading-snug text-paper">
                “{collection.description}”
              </p>
            </div>
          )}
        </div>

        {/* Pieces from the edit */}
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-2">
            {products.map((p, i) => (
              <li key={p.handle}>
                <ProductCard product={p} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
