'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export async function deleteOrder(id: string) {
  const order = (
    await db.delete(orders).where(eq(orders.id, id)).returning()
  )[0];

  if (order == null) return notFound();

  return order;
}
