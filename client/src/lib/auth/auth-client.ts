import { createAuthClient } from "better-auth/react";

export const {
  signUp,
  signIn,
  signOut,
  resetPassword,
  useSession,
} = createAuthClient();
