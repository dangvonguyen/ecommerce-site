'use server';

import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db, users } from '@/db';

export async function deleteUser(id: string) {
  const user = (await db.delete(users).where(eq(users.id, id)).returning())[0];

  if (user == null) return notFound();

  return user;
}
