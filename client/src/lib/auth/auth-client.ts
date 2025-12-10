import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const {
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  resetPassword,
  useSession
} = createAuthClient({
  sessionOptions: {
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000
  },
  plugins: [
    inferAdditionalFields({
      user: {
        plan: {
          type: ["Hobby", "Pro monthly", "Pro yearly"] as const,
          required: true,
          defaultValue: "Hobby",
        },
        subscriptionStatus: {
          type: "string",
          required: false,
        },
      },
    })
  ]
});
