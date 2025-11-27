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

  const session = data?.session
  const isAuthRoute = authRoutes.includes(pathname.replace(/\/$/, ""));
  const hasSession = !!(session);

  useEffect(() => {
    if (isPending || isRefetching) return;
    if (!isAuthRoute && !hasSession) {
        navigate("/login", { replace: true });
        return;
      }
    if (isAuthRoute && hasSession) {
      navigate("/", { replace: true });
      return;
    }
  }, [isAuthRoute, hasSession, isPending, isRefetching, navigate]);

  if (isPending || isRefetching) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  }

  return (
    <div className="w-full h-screen grid grid-rows-[auto, 1fr]">
      {!isAuthRoute && <Navbar hasSession={hasSession} />}
      <div className="overflow-y-auto scroll-smooth bg-linear-to-br from-gray-50 to-gray-100">
        {children}
      </div>
    </div>
  );
}

export default AuthWrapper;
