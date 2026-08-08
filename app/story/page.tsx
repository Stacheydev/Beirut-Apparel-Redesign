import type { Metadata } from "next";
import { ProductImage } from "@/components/ui/ProductImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SITE, getProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Beirut Apparel began in May 2019 — two best friends, one city, and the idea that what you wear should carry the spirit of where you come from.",
};

export default function StoryPage() {
  const story = SITE.story;
  const product = getProduct("champagne-muse-strapless-satin-set");
  const image = product?.images[0]?.url ?? "/placeholder-product.svg";

  return (
    <div className="shell pt-6">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Story" }]}
      />

      <div className="mx-auto mt-10 max-w-4xl text-center">
        <p className="eyebrow mb-4 text-muted">Our story</p>
        <h1 className="display text-5xl text-balance text-ink sm:text-6xl">
          {story.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted sm:text-lg">
          {story.intro}
        </p>
      </div>

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden bg-sand">
          <ProductImage
            src={image}
            alt="Beirut Apparel"
            className="aspect-[4/5] h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-[16px] leading-relaxed text-muted">{story.body}</p>
          <p className="mt-6 font-display text-xl italic text-ink">
            — {SITE.store.founders}
          </p>
        </div>
      </div>

      {/* Pillars */}
      <section className="mt-20 grid gap-px border-y border-line bg-line sm:grid-cols-3">
        {story.pillars.map((p) => (
          <div key={p.title} className="bg-paper p-8">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-lagoon">
              {p.title}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{p.description}</p>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section className="mt-20">
        <p className="eyebrow mb-8 text-muted">The journey</p>
        <ol className="relative space-y-8 border-l border-line pl-8">
          {story.timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full border border-lagoon bg-paper" />
              <span className="font-display text-2xl text-lagoon">{t.year}</span>
              <p className="mt-1 text-[14px] text-muted">{t.label}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Concept note */}
      <section className="mt-20 border border-line bg-sand/50 p-8 sm:p-12">
        <p className="eyebrow mb-3 text-muted">This concept</p>
        <h2 className="display text-3xl text-ink">{SITE.about.headline}</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          {SITE.about.intro}
        </p>
      </section>
    </div>
  );
}
