import type { User } from "better-auth";
import { type ReactNode } from "react";
import { AuthContext } from "./useAuth";

const AuthProvider = ({ user, children }: {
  user: User | null;
  children: ReactNode;
}) => (
  <AuthContext.Provider value={{ user }}>
    {children}
  </AuthContext.Provider>
);

export default AuthProvider;
