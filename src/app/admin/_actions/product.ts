'use server';

import fs from 'fs/promises';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import { db, products } from '@/db';

const addSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: z.file().min(1),
  image: z
    .file()
    .min(1)
    .refine((file) => file.type.startsWith('image/')),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      data: {
        name: (formData.get('name') as string) || '',
        description: (formData.get('description') as string) || '',
        priceInCents: Number(formData.get('priceInCents')) || 0,
        file: null,
        image: null,
      },
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const { name, description, priceInCents, file, image } = result.data;

  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${file.name}`;
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await image.arrayBuffer())
  );

  await db.insert(products).values({
    name,
    description,
    priceInCents,
    isAvailableForPurchase: false,
    filePath,
    imagePath,
  });

  revalidatePath('/');
  revalidatePath('/products');

  redirect('/admin/products');
}

const editSchema = addSchema.extend({
  file: z.file().optional(),
  image: z
    .file()
    .refine((file) => file.size === 0 || file.type.startsWith('image/'))
    .optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      data: {
        name: (formData.get('name') as string) || '',
        description: (formData.get('description') as string) || '',
        priceInCents: Number(formData.get('priceInCents')) || 0,
        file: null,
        image: null,
      },
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const { name, description, priceInCents, file, image } = result.data;
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (product == null) return notFound();

  let filePath = product.filePath;
  if (file != null && file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (image != null && image.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await image.arrayBuffer())
    );
  }

  await db
    .update(products)
    .set({ name, description, priceInCents, filePath, imagePath })
    .where(eq(products.id, id));

  revalidatePath('/');
  revalidatePath('/products');

  redirect('/admin/products');
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db
    .update(products)
    .set({ isAvailableForPurchase: isAvailableForPurchase })
    .where(eq(products.id, id));

  revalidatePath('/');
  revalidatePath('/products');
}

export async function deleteProduct(id: string) {
  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({
      filePath: products.filePath,
      imagePath: products.imagePath,
    });

  if (deleted.length === 0) return notFound();

  const { filePath, imagePath } = deleted[0];

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Error deleting file at "${filePath}":`, err);
  }

  try {
    await fs.unlink(`public${imagePath}`);
  } catch (err) {
    console.error(`Error deleting image at "public${imagePath}":`, err);
  }

  revalidatePath('/');
  revalidatePath('/products');
}
