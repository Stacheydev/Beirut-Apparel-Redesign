import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/cn";

interface ProductGridProps {
  products: Product[];
  cols?: 2 | 3 | 4;
  priority?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  cols = 3,
  priority,
  className,
}: ProductGridProps) {
  const colsClass = {
    2: "grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[cols];

  return (
    <ul className={cn("grid gap-x-4 gap-y-10 sm:gap-x-6", colsClass, className)}>
      {products.map((product, i) => (
        <li key={product.handle}>
          <ProductCard product={product} priority={priority && i < cols} />
        </li>
      ))}
    </ul>
  );
}
