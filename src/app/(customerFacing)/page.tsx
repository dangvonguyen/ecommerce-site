import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { count, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function getNewestProducts() {
  return db
    .select({
      ...getTableColumns(products),
      ordersCount: count(orders.id),
    })
    .from(products)
    .where(eq(products.isAvailableForPurchase, true))
    .leftJoin(orders, eq(orders.productId, products.id))
    .groupBy(products.id)
    .orderBy(products.createdAt)
    .limit(7);
}

function getMostPopularProducts() {
  return db
    .select({
      ...getTableColumns(products),
      ordersCount: count(orders.id).as('orders_count'),
    })
    .from(products)
    .where(eq(products.isAvailableForPurchase, true))
    .leftJoin(orders, eq(orders.productId, products.id))
    .groupBy(products.id)
    .orderBy(desc(sql`"orders_count"`))
    .limit(7);
}

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
    </main>
  );
}

type ProductFetcher = () => Promise<
  (typeof products.$inferSelect & { ordersCount: number })[]
>;

type ProductGridSectionProps = {
  title: string;
  productsFetcher: ProductFetcher;
};

function ProductGridSection({
  title,
  productsFetcher,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspend productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspend({
  productsFetcher,
}: {
  productsFetcher: ProductFetcher;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
