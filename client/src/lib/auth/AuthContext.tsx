import { type ReactNode } from "react";
import { type AppUser, AuthContext } from "./useAuth";

const AuthProvider = ({ user, children }: {
  user: AppUser | null;
  children: ReactNode;
}) => (
  <AuthContext.Provider value={{ user }}>
    {children}
  </AuthContext.Provider>
);

export default AuthProvider;
