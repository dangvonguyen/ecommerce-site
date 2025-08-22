import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const products = t.pgTable('products', {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.varchar({ length: 256 }).notNull(),
  priceInCents: t.integer().notNull(),
  filePath: t.text().notNull(),
  imagePath: t.text().notNull(),
  description: t.text().notNull(),
  isAvailableForPurchase: t.boolean().default(true).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  orders: many(orders),
  downloadVerifications: many(downloadVerifications),
}));

export const users = t.pgTable('users', {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: t.varchar({ length: 256 }).unique().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const orders = t.pgTable('orders', {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  pricePaidInCents: t.integer().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),

  userId: t
    .uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: t
    .uuid()
    .notNull()
    .references(() => products.id, { onDelete: 'restrict' }),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

export const downloadVerifications = t.pgTable('download_verifications', {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),

  productId: t
    .uuid()
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export const downloadVerificationsRelations = relations(
  downloadVerifications,
  ({ one }) => ({
    product: one(products, {
      fields: [downloadVerifications.productId],
      references: [products.id],
    }),
  })
);
