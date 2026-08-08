import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { SITE, getProduct } from "@/lib/catalog";

/**
 * Editorial hero — a real product photograph, framed like a fashion
 * magazine opener. Copy echoes the brand's real positioning.
 */
export function Hero() {
  const hero = SITE.hero;
  const product = getProduct(hero.productHandle ?? "");
  const image = product?.images[0]?.url ?? "/placeholder-product.svg";
  const alt = product?.title ?? "Beirut Apparel editorial";

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative h-[78vh] min-h-[520px] w-full sm:h-[86vh]">
        <ProductImage src={image} alt={alt} className="h-full w-full" priority sizes="100vw" />
        {/* Scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

        <div className="shell relative z-10 flex h-full flex-col justify-end pb-14 sm:justify-center sm:pb-0">
          <div className="max-w-xl animate-fade-up">
            <p className="eyebrow mb-4 text-paper/70">{hero.eyebrow}</p>
            <h1 className="display text-4xl text-paper text-balance sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/75 sm:text-base">
              {hero.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="lagoon" size="lg" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button variant="light" size="lg" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
