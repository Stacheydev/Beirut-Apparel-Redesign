import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LookView } from "@/components/looks/LookView";
import { ALL_LOOKS, getLook } from "@/lib/catalog";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_LOOKS.map((l) => ({ slug: l.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const look = getLook(params.slug);
  if (!look) return {};
  return {
    title: `${look.title} — Look`,
    description: look.tagline,
  };
}

export default function LookPage({ params }: PageProps) {
  const look = getLook(params.slug);
  if (!look) notFound();
  return <LookView look={look} />;
}
