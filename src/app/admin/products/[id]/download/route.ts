import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (product == null) return notFound();

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split('.').pop();

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Disposition': `attachment; filename="${product.name}.${extension}"`,
      'Content-Length': size.toString(),
      'Content-Type': 'application/octet-stream',
    },
  });
}
