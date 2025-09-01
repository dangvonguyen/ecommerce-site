import { db } from '@/db';
import { orders, users } from '@/db/schema';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'charge.succeeded':
      const charge = event.data.object;

      if (charge.metadata.productId) {
        await createOrder(charge);
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function createOrder(charge: Stripe.Charge) {
  const productId = charge.metadata.productId;
  const email = charge.billing_details.email;
  const pricePaidInCents = charge.amount;

  if (!productId || !email) {
    console.error('Missing customer email or product ID');
    return;
  }

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({ email: email })
      .returning();
    user = newUser;
  }

  // Create order
  await db
    .insert(orders)
    .values({
      userId: user.id,
      productId,
      pricePaidInCents,
    })
    .returning();

  try {
    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: <h1>Order Confirmation - Thank you for your purchase!</h1>,
    });
  } catch (error) {
    console.error('Resent error:', error);
  }

  console.log(`Order created for user ${email}, product ${productId}`);
}
