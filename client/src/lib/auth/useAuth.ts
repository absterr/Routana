import type { User } from "better-auth";
import { createContext, useContext } from "react";

export interface AppUser extends User {
  plan: "Hobby" | "Pro monthly" | "Pro yearly";
  subscriptionStatus?: string | null | undefined;
}

type AuthContextValue = {
  user: AppUser | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
