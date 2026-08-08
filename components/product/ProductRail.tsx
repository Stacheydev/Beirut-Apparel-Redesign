import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/cn";

interface ProductRailProps {
  products: Product[];
  priority?: boolean;
  className?: string;
}

/** Horizontally scrolling product rail for merchandising sections. */
export function ProductRail({ products, priority, className }: ProductRailProps) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:px-0",
        className,
      )}
    >
      {products.map((product, i) => (
        <div
          key={product.handle}
          className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[30vw] lg:w-[23.5vw]"
        >
          <ProductCard product={product} priority={priority && i < 3} />
        </div>
      ))}
    </div>
  );
}
