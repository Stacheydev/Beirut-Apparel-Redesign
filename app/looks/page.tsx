import type { Metadata } from "next";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { LookCard } from "@/components/looks/LookCard";
import { ALL_LOOKS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Looks",
  description:
    "Styled outfits from Beirut Apparel — coordinating separates, put together for you. Shop each piece, or add the whole look to your bag.",
};

export default function LooksPage() {
  return (
    <>
      <CollectionHeader
        eyebrow="The lookbook"
        title="Looks we've put together"
        description="Start with an outfit, not a product. Each look is built from the brand's coordinating separates — see it whole, then shop each piece."
        count={ALL_LOOKS.length}
        crumbs={[{ label: "Home", href: "/" }, { label: "Looks" }]}
      />
      <div className="shell py-12">
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_LOOKS.map((look) => (
            <li key={look.handle}>
              <LookCard look={look} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
