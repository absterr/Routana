import Dashboard from "@/pages/dashboard";
import NewGoal from "@/pages/new-goal";
import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import LoginPage from "./pages/auth/login";
import ResetPasswordPage from "./pages/auth/reset-password";
import SignupPage from "./pages/auth/signup";
import RoadmapSVG from "./pages/roadmap";

export default function App() {
  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewGoal />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/roadmap" element={<RoadmapSVG />} />
      </Routes>
    </div>
  );
};
