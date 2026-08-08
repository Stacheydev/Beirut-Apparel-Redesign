import type { Metadata } from "next";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse every piece from Beirut Apparel — linen, satin, swimwear, dresses, abayas and more.",
};

export default function ShopPage() {
  return (
    <>
      <CollectionHeader
        eyebrow="Shop all"
        title="Everything, sun-washed"
        description="The full Beirut Apparel wardrobe — linen, satin, swimwear and seasonal edits, designed in Beirut for the everyday."
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <div className="shell py-10 sm:py-14">
        <CatalogView context={{ kind: "all" }} />
      </div>
    </>
  );
}
