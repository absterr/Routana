import { betterAuth } from "better-auth";
import { db } from "../db/drizzle.js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
})
