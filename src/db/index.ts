import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export const db = drizzle(process.env.DATABASE_URL!);

// export const db = drizzle({
//   connection: process.env.DATABASE_URL!,
//   casing: 'snake_case',
// });

// async function main() {
//   const user: typeof users.$inferInsert = {
//     email: 'foo@gmail.com()',
//   };

//   await db.insert(users).values(user);
//   console.log('new user created');

//   const db_users = await db.select().from(users);
//   console.log('getting all users from the database: ', db_users);

//   await db
//     .update(users)
//     .set({ email: 'bar@change.com' })
//     .where(eq(users.id, user.id));
// }

// main();
