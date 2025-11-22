import Dashboard from "@/pages/dashboard";
import NewGoal from "@/pages/new-goal";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewGoal />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
};
