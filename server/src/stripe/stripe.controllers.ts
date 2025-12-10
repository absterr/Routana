import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import { Router, raw } from "express";
import Stripe from "stripe";
import z from "zod";
import { db } from "../db/drizzle.js";
import { user } from "../db/models/auth.models.js";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";

const stripeRoutes = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const PRODUCT_ID = env.STRIPE_PRODUCT_ID;
const WEBHOOK_KEY = env.STRIPE_WEBHOOK_KEY;

type UserPlan = "Hobby" | "Pro monthly" | "Pro yearly";

// CHECKOUT
stripeRoutes.post("/checkout", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const userId = session.user.id;
  const email = session.user.email;
  const checkoutSchema = z.object({
    interval: z.enum(["month", "year"])
  });

  const prices = await stripe.prices.list({
    product: PRODUCT_ID,
    active: true
  });

  try {
    const { interval } = checkoutSchema.parse(req.body);

    const price = prices.data.find(p => p.recurring?.interval === interval);
    if (!price) {
      return res.status(400).json({ error: "Invalid price interval" });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data.length
      ? customers.data[0]
      : await stripe.customers.create({ email, metadata: { userId } });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.BETTER_AUTH_URL}/billing?action=checkout&status=success`,
      cancel_url: `${process.env.BETTER_AUTH_URL}/billing?action=checkout&status=cancel`,
      metadata: { userId },
    });

    return res.status(200).json({ url: session.url });
  } catch(err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid checkout request" });
    }

    return res.status(500).json({ error: `An unexptected error occured: `})
  }
});

// WEBHOOK
stripeRoutes.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  let event: Stripe.Event;
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      WEBHOOK_KEY
    );
  } catch (err) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const prices = await stripe.prices.list({
    product: PRODUCT_ID,
    active: true
  });

  const map: Record<string, UserPlan> = {};
  for (const price of prices.data) {
    if (price.recurring?.interval === "month") {
      map[price.id] = "Pro monthly"
    } else if (price.recurring?.interval === "year") {
      map[price.id] = "Pro yearly"
    } else {
      map[price.id] = "Hobby"
    }
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) {
          return res.status(500).json({ error: "User ID is not set" });
        }

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const plan = map[priceId];

        await db
          .update(user)
          .set({
            plan,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: subscription.status,
            subscriptionExpiresAt: new Date(
              (session.expires_at ?? Date.now()) * 1000
            ),
          })
          .where(eq(user.id, userId));
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const [currentUser] = await db
          .select()
          .from(user)
          .where(eq(user.stripeCustomerId, customerId))
          .limit(1);
        if (!currentUser) {
          break;
        }

        const priceId = subscription.items.data[0].price.id;
        const plan = map[priceId];
        const isPendingCancel = subscription.cancel_at_period_end === true;

        await db
          .update(user)
          .set({
            plan,
            subscriptionStatus: isPendingCancel
              ? "canceled"
              : subscription.status,
            subscriptionExpiresAt: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
          })
          .where(eq(user.id, currentUser.id));
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const [currentUser] = await db
          .select()
          .from(user)
          .where(eq(user.stripeCustomerId, customerId))
          .limit(1);
        if (!currentUser) {
          break;
        }

        await db
          .update(user)
          .set({
            plan: "Hobby",
            subscriptionStatus: null,
            subscriptionExpiresAt: null,
          })
          .where(eq(user.id, currentUser.id));
        break;
      }
      default:
        return res.json({ error: `Unhandled event type: ${event.type}` });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to handle stripe event" });
  }
});

export default stripeRoutes;
