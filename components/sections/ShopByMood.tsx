import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MOODS, moodProducts } from "@/lib/catalog";
import type { Mood } from "@/types/catalog";

function moodImage(mood: Mood): string | undefined {
  return moodProducts(mood).find((p) => p.images[0])?.images[0]?.url;
}

/**
 * "Shop the moment" — mood/occasion discovery, each path backed by real
 * categories (By the Sea, Golden Hour, Everyday Linen…).
 */
export function ShopByMood() {
  return (
    <section className="shell py-16 sm:py-24">
      <SectionHeading
        index="02"
        eyebrow="Shop the moment"
        title="How do you want to feel?"
        description="Fashion starts with a feeling, not a category. Browse by the moment you're dressing for."
        href="/shop"
        linkLabel="Shop everything"
      />

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {MOODS.map((mood, i) => {
          const image = moodImage(mood);
          return (
            <li key={mood.handle}>
              <Link href={`/moods/${mood.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  {image ? (
                    <ProductImage
                      src={image}
                      alt={mood.title}
                      className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/10 to-transparent p-5">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-paper/70">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-display text-2xl text-paper">{mood.title}</p>
                      <p className="mt-1 text-[13px] text-paper/75">{mood.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-paper">
                        Shop the mood
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
