import Dashboard from "@/pages/dashboard";
import NewGoal from "@/pages/new-goal";
import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import LoginPage from "./pages/auth/login";
import ResetPasswordPage from "./pages/auth/reset-password";
import SignupPage from "./pages/auth/signup";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewGoal />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
};
