'use server';

import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { z } from 'zod';

import { db, downloadVerifications, users } from '@/db';
import { OrderHistoryEmail } from '@/email/OrderHistory';

const emailSchema = z.email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get('email'));

  if (result.success === false) {
    return { error: 'Invalid email address' };
  }

  const user = await db.query.users.findFirst({
    columns: { email: true },
    where: eq(users.email, result.data),
    with: {
      orders: {
        columns: { id: true, pricePaidInCents: true, createdAt: true },
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        'Check your email to view your order history and download your products.',
    };
  }

  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await db
          .insert(downloadVerifications)
          .values({
            productId: order.product.id,
            expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
          })
          .returning()
      )[0].id,
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Order History',
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  if (data.error) {
    return {
      error: 'There was an error sending your email. Please try again.',
    };
  }

  return {
    message:
      'Check your email to view your order history and download your products.',
  };
}
