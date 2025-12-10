import DashboardPage from "@/pages/main/dashboard";
import NewGoalPage from "@/pages/main/new-goal";
import Roadmap from "@/pages/main/roadmap";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AuthWrapper from "./components/AuthWrapper/AuthWrapper";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import LoginPage from "./pages/auth/login";
import ResetPasswordPage from "./pages/auth/reset-password";
import SignupPage from "./pages/auth/signup";
import GoalsPage from "./pages/main/goals";
import BillingPage from "./pages/main/billing/billing";

export default function App() {
  return (
    <>
      <AuthWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/" element={<DashboardPage />} />
          <Route path="/new-goal" element={<NewGoalPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/:id" element={<Roadmap />} />

          <Route path="/billing" element={<BillingPage />} />
        </Routes>
      </AuthWrapper>
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "rounded-xl shadow-md border text-sm",
            success: "bg-green-100 border-green-500 text-green-900",
            error: "bg-red-100 border-red-500 text-red-900",
          },
        }}
      />
    </>
  );
};
