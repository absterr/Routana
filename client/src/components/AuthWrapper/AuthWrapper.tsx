import LoadingSpinner from "@/components/LoadingSpinner";
import { useSession } from "@/lib/auth/auth-client";
import AuthProvider from "@/lib/auth/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data, isPending, isRefetching } = useSession();

  const session = data?.session;
  const user = data?.user ?? null;
  const plainPath = pathname.replace(/\/$/, "")
  const isPricing = plainPath === "/pricing"

  const isAuthRoute = authRoutes.includes(plainPath);
  const isGuestRoute = isAuthRoute || plainPath === "";

  const hasSession = !!(session);
  const isLoading = isPending || (isRefetching && !data);

  const notAuthenticated = !isGuestRoute && !hasSession && !isPricing;
  const isAuthenticated = isGuestRoute && hasSession && !isPricing;

  useEffect(() => {
    if (isLoading) return;
    if (notAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isLoading, notAuthenticated, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="min-h-[95vh] flex items-center justify-center">
      <LoadingSpinner size={8} />
    </div>
  }

  return (
    <AuthProvider user={user}>
      <div className="fixed inset-0 w-full h-dvh grid grid-rows-[auto, 1fr] overscroll-none overflow-hidden">
          {!isAuthRoute && <Navbar hasSession={hasSession} />}
        <main className="overscroll-none overflow-y-auto scroll-smooth bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}

export default AuthWrapper;
