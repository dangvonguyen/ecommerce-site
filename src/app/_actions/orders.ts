'use server';

import { db } from '@/db';
import { orders, users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function userOrderExists(email: string, productId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user == null) return false;

  const order = await db.query.orders.findFirst({
    columns: { id: true },
    where: and(eq(orders.productId, productId), eq(orders.userId, user.id)),
  });

  return order != null;
}
