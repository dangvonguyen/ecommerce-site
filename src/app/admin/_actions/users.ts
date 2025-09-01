'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export async function deleteUser(id: string) {
  const user = (await db.delete(users).where(eq(users.id, id)).returning())[0];

  if (user == null) return notFound();

  return user;
}
