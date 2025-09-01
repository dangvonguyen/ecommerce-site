import { eq } from 'drizzle-orm';

import { db, products } from '@/db';

import { PageHeader } from '../../../_components/PageHeader';
import { ProductForm } from '../../_components/ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  return (
    <>
      <PageHeader>Edit Products</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
