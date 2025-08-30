'use server';

import { db } from '@/db';
import { products } from '@/db/schema';
import { z } from 'zod';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

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
  const filePath = `products/${file.name}-${crypto.randomUUID()}`;
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${image.name}-${crypto.randomUUID()}`;
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

  redirect('/admin/products');
}
