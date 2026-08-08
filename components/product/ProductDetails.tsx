import { Accordion } from "@/components/ui/Accordion";
import type { Product } from "@/types/catalog";

interface ProductDetailsProps {
  product: Product;
}

/**
 * Product details accordions — fabric, fit, care, shipping & exchanges.
 * Fabric facts come from the real listing; fit/care/shipping are editorial
 * guidance (no invented measurements).
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const items = [
    {
      title: "Fabric & details",
      content: product.material
        ? `Made from ${product.material.toLowerCase()} — designed in Beirut for warm days and easy evenings.`
        : "Designed in Beirut for warm days and easy evenings.",
      defaultOpen: true,
    },
    {
      title: "Fit",
      content:
        "Beirut Apparel sizes to two easy fits (XS–S / M–L), so choosing is simple. Not sure? We offer exchanges within 7 days of receiving your order — unused, unworn and with tags attached.",
    },
    {
      title: "Care",
      content:
        "To keep the fabric at its best, wash on a gentle cycle in cold water and hang to dry away from direct sun. Iron on low where needed.",
    },
    {
      title: "Shipping & exchanges",
      content:
        "Orders are fulfilled from Lebanon. Exchanges only, within 7 days of receiving your order — items must be unused, unworn and in original condition with tags attached. Refunds are not available.",
    },
  ];

  return <Accordion items={items} />;
}
