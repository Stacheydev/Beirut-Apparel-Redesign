import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { SITE, getProduct } from "@/lib/catalog";

/** Brand story strip — real facts (May 2019, Lynn & Nour, Beirut). */
export function BrandStory() {
  const story = SITE.story;
  const product = getProduct("amara-beige-abaya");
  const image = product?.images[0]?.url ?? "/placeholder-product.svg";

  return (
    <section className="bg-ink py-16 text-paper sm:py-24">
      <div className="shell grid items-center gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden bg-sand">
          <ProductImage
            src={image}
            alt="Beirut Apparel craftsmanship"
            className="aspect-[4/5] h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute bottom-0 left-0 p-5">
            <span className="bg-paper/95 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-ink">
              Founded {SITE.store.founded}
            </span>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3 text-lagoon">Our story</p>
          <h2 className="display text-4xl text-balance sm:text-5xl">{story.headline}</h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-paper/70">
            {story.intro}
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/55">
            {story.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="lagoon" href="/story">
              Read our story
            </Button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-b border-paper/30 pb-1 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper"
            >
              Get in touch <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
