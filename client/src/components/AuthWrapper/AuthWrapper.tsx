import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useSession } from "@/lib/auth/auth-client";

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data, isPending, isRefetching } = useSession();

  const session = data?.session;
  const isAuthRoute = authRoutes.includes(pathname.replace(/\/$/, ""));
  const hasSession = !!(session);

  const isLoading = isPending || (isRefetching && !data);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthRoute && !hasSession) {
        navigate("/login", { replace: true });
        return;
      }
    if (isAuthRoute && hasSession) {
      navigate("/", { replace: true });
      return;
    }
  }, [isLoading, isAuthRoute, hasSession, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={8} />
    </div>
  }

  return (
    <div className="w-full h-screen grid grid-rows-[auto, 1fr]">
      {!isAuthRoute && <Navbar hasSession={hasSession} />}
      <main className="overflow-y-auto scroll-smooth bg-linear-to-br from-gray-50 to-gray-100">
        {children}
      </main>
    </div>
  );
}

export default AuthWrapper;
