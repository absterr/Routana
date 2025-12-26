import { fromNodeHeaders } from "better-auth/node";
import { Router, raw } from "express";
import Stripe from "stripe";
import z from "zod";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";

type UserPlan = "Hobby" | "Pro monthly" | "Pro yearly";

const stripeRoutes = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const PRODUCT_ID = env.STRIPE_PRODUCT_ID;


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

    return res.status(500).json({ error: "Failed to establish checkout session" });
  }
});


// CANCEL SUBSCRIPTION
stripeRoutes.post("/cancel", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const userSubscriptionId = session.user.stripeSubscriptionId;
  if (!userSubscriptionId) {
    return res.status(400).json({ error: "Invalid subscription ID " });
  }

  try {
    const subscription = await stripe.subscriptions.update(userSubscriptionId, {
      cancel_at_period_end: true,
    });
    return res.json({
      canceled: subscription.cancel_at_period_end,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to cancel subscription" });
  }
});


// BILLING PORTAL
stripeRoutes.post("/portal", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const userCustomerId = session.user.stripeCustomerId;
  if (!userCustomerId) {
    return res.status(400).json({ error: "Invalid customer ID " });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: userCustomerId,
      return_url: `${process.env.BETTER_AUTH_URL}/billing`,
    });
    return res.json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: "Failed to establish session" });
  }
});

export default stripeRoutes;
