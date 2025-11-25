import LoadingSpinner from "@/components/LoadingSpinner";
import useCachedSession from "@/lib/auth/useCachedSession";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data, isPending } = useCachedSession();

  const session = data?.data?.session;
  const isAuthRoute = authRoutes.includes(pathname);
  const isAuthenticated = !!(session);

  useEffect(() => {
    if (isPending) return;
    if (!isAuthRoute && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (isAuthRoute && isAuthenticated) {
      navigate("/", { replace: true });
      return;
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
