import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/catalog/CollectionHeader";
import { CatalogView } from "@/components/catalog/CatalogView";
import { MOODS, moodProducts } from "@/lib/catalog";

interface PageProps {
  params: { handle: string };
}

export function generateStaticParams() {
  return MOODS.map((m) => ({ handle: m.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const mood = MOODS.find((m) => m.handle === params.handle);
  if (!mood) return {};
  return {
    title: mood.title,
    description: mood.description,
  };
}

export default function MoodPage({ params }: PageProps) {
  const mood = MOODS.find((m) => m.handle === params.handle);
  if (!mood) notFound();

  const products = moodProducts(mood);

  return (
    <>
      <CollectionHeader
        eyebrow="Shop the moment"
        title={mood.title}
        description={mood.description}
        count={products.length}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop the moment", href: "/" }, { label: mood.title }]}
      />
      <div className="shell py-10 sm:py-14">
        <CatalogView context={{ kind: "mood", categories: mood.categories }} />
      </div>
    </>
  );
}
