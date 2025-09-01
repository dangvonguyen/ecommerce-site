'use server';

import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db, orders } from '@/db';

export async function deleteOrder(id: string) {
  const order = (
    await db.delete(orders).where(eq(orders.id, id)).returning()
  )[0];

  if (order == null) return notFound();

  return order;
}
