import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { db } from '@/db';
import { products } from '@/db/schema';
import { cache } from '@/lib/cache';
import { asc, eq } from 'drizzle-orm';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspend />
      </Suspense>
    </div>
  );
}

const getProducts = cache(() => {
  return db.query.products.findMany({
    where: eq(products.isAvailableForPurchase, true),
    orderBy: [asc(products.name)],
  });
}, ['/products', 'getProducts']);

async function ProductsSuspend() {
  const result = await getProducts();

  return result.map((product) => <ProductCard key={product.id} {...product} />);
}
