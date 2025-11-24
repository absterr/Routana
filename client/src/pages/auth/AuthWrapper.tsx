import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../lib/auth/auth-client";
import LoadingSpinner from "./LoadingSpinner";

const authRoutes = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]);

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data, isPending } = useSession();
  const isAuthRoute = authRoutes.has(pathname);
  const isAuthenticated = !!(data && data.session);

  useEffect(() => {
    if (isPending) return;
    if (!isAuthRoute && !isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (isAuthRoute && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isPending, isAuthRoute, navigate]);

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
      </div>
  }

  return <div className="bg-linear-to-br from-gray-50 to-gray-100">
    {children}
  </div>
}

export default AuthWrapper;
