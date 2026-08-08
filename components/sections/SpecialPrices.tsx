import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { saleProducts } from "@/lib/catalog";

interface SpecialPricesProps {
  count?: number;
}

/** Past-season favourites at reduced prices — the brand's "Special Prices". */
export function SpecialPrices({ count = 6 }: SpecialPricesProps) {
  const products = saleProducts(count);
  if (products.length === 0) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Special prices"
          title="Last season, better price"
          href="/collections/discounted-items"
          linkLabel="Shop all special prices"
        />
        <div className="mt-10">
          <ProductRail products={products} />
        </div>
      </div>
    </section>
  );
}
