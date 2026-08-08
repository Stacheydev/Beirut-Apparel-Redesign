import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { EditOfTheSeason } from "@/components/sections/EditOfTheSeason";
import { ShopByMood } from "@/components/sections/ShopByMood";
import { FeaturedLooks } from "@/components/sections/FeaturedLooks";
import { NewIn } from "@/components/sections/NewIn";
import { SpecialPrices } from "@/components/sections/SpecialPrices";
import { BrandStory } from "@/components/sections/BrandStory";
import { TrustBar } from "@/components/sections/TrustBar";
import { MERCHANDISING } from "@/lib/catalog";

export default function HomePage() {
  const featuredEdits = MERCHANDISING.homepage?.featuredEdits ?? [];

  return (
    <>
      <Hero />
      <Ticker />
      {featuredEdits[0] && <EditOfTheSeason collectionHandle={featuredEdits[0]} index="01" />}
      <ShopByMood />
      <FeaturedLooks />
      <NewIn />
      <SpecialPrices />
      <BrandStory />
      <TrustBar />
    </>
  );
}
