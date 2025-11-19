import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import NewGoal from "./pages/new-goal";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewGoal />} />
      </Routes>
    </>
  );
};
