import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import { Router } from "express";
import z from "zod";
import { db } from "../db/drizzle.js";
import { user } from "../db/models/auth.models.js";
import { auth } from "../lib/auth.js";

const userRoutes = Router();

userRoutes.patch("/name", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const currentUserId = session.user.id;
  const nameSchema = z.object({
    newName: z.string()
      .min(1, "Name is required")
      .max(24, "Name must be less than 25 characters")
  });

  try {
    const { newName } = nameSchema.parse(req.body);

    await db.update(user)
      .set({ name: newName })
      .where(eq(user.id, currentUserId));

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }

    return res.status(500).json({ error: "Failed to set new user name" });
  }
});

userRoutes.delete("/delete", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const currentUserId = session.user.id;

  try {
    await db.delete(user).where(eq(user.id, currentUserId));

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete user account" });
  }
});

export default userRoutes;
