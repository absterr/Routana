import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle.js";
import { account, session, user, verification } from "../db/models/auth.models.js";
import { sendAuthMail } from "./email.js";
import { EMAIL_VERIFICATION_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "./emailTemplates.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        subject: "Password reset",
        template: PASSWORD_RESET_TEMPLATE,
        url
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthMail({
        to: user.email,
        subject: "Email verification",
        template: EMAIL_VERIFICATION_TEMPLATE,
        url
      });
    }
  }
});
