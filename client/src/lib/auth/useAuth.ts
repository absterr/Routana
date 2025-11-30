import type { User } from "better-auth";
import { createContext, useContext } from "react";

type AuthContextValue = {
  user: User | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
