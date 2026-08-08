import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { ProductDetails } from "@/components/product/ProductDetails";
import { CompleteTheLook } from "@/components/product/CompleteTheLook";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ALL_PRODUCTS, getProduct, getRecommendedProducts, getRecommendations } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";

interface PageProps {
  params: { handle: string };
}

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProduct(params.handle);
  if (!product) return {};
  return {
    title: `${product.title} — ${formatMoney(product.price.amount)}`,
    description:
      product.description ||
      `${product.title} from Beirut Apparel${product.material ? ` — ${product.material}` : ""}.`,
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProduct(params.handle);
  if (!product) notFound();

  const related = getRecommendedProducts(
    getRecommendations(product.handle, ["related"]),
  ).filter((p) => p.handle !== product.handle).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.url),
    description: product.description || `${product.title} from Beirut Apparel.`,
    brand: { "@type": "Brand", name: "Beirut Apparel" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.amount / 100,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="shell pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: product.category, href: "/shop" },
          { label: product.title },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} />
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <ProductBuyBox product={product} />
            <div className="mt-8">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      <CompleteTheLook product={product} />

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-10">
          <SectionHeading
            eyebrow="You may also like"
            title="In the same spirit"
            href="/shop"
            linkLabel="Shop all"
          />
          <div className="mt-8">
            <ProductRail products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
