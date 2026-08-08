import { SectionHeading } from "@/components/ui/SectionHeading";
import { LookCard } from "@/components/looks/LookCard";
import { ALL_LOOKS } from "@/lib/catalog";

interface FeaturedLooksProps {
  count?: number;
}

/** Outfit-based discovery — the brand's coordinating separates, styled. */
export function FeaturedLooks({ count = 3 }: FeaturedLooksProps) {
  const looks = ALL_LOOKS.slice(0, count);
  if (looks.length === 0) return null;

  return (
    <section className="border-t border-line bg-sand/40 py-16 sm:py-24">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Styled for you"
          title="Looks we've put together"
          description="Coordinating separates, styled into outfits — see it whole, then shop each piece."
          href="/looks"
          linkLabel="All looks"
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {looks.map((look, i) => (
            <li key={look.handle}>
              <LookCard look={look} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
