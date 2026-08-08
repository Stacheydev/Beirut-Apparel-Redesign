import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { newArrivals } from "@/lib/catalog";

interface NewInProps {
  count?: number;
}

/** Newest pieces — derived from real publish dates in the dataset. */
export function NewIn({ count = 8 }: NewInProps) {
  const products = newArrivals(count);
  if (products.length === 0) return null;

  return (
    <section className="shell py-16 sm:py-24">
      <SectionHeading
        index="04"
        eyebrow="Just landed"
        title="New this week"
        href="/shop?sort=newest"
        linkLabel="See everything new"
      />
      <div className="mt-10">
        <ProductRail products={products} />
      </div>
    </section>
  );
}
