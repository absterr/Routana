import { createAuthClient } from "better-auth/react";

export const {
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  resetPassword,
  useSession,
} = createAuthClient();
