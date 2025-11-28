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
  }
});
