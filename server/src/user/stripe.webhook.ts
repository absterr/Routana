import { eq } from "drizzle-orm";
import { Router, raw } from "express";
import Stripe from "stripe";
import { db } from "../db/drizzle.js";
import { user } from "../db/models/auth.models.js";
import env from "../lib/env.js";

type UserPlan = "Hobby" | "Pro monthly" | "Pro yearly";

const stripeWebhook = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const PRODUCT_ID = env.STRIPE_PRODUCT_ID;
const WEBHOOK_KEY = env.STRIPE_WEBHOOK_KEY;


stripeWebhook.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
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
              (subscription.cancel_at ?? Date.now()) * 1000
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

export default stripeWebhook;
