import { db } from '@/db';
import { PageHeader } from '../../../_components/PageHeader';
import { ProductForm } from '../../_components/ProductForm';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = (
    await db.select().from(products).where(eq(products.id, id))
  )[0];

  return (
    <>
      <PageHeader>Edit Products</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
