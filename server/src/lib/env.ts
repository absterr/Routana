import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GEMINI_API_KEY: z.string(),
  STRIPE_PRODUCT_ID: z.string(),
  STRIPE_SECRET_KEY: z.string(),
});

const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default env;
