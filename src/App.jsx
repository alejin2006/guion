import { useState } from "react";
import Auth      from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

export default function App() {
  const [page, setPage] = useState("auth");

  if (page === "auth")
    return <Auth onLogin={() => setPage("dashboard")} />;

  return <Dashboard onLogout={() => setPage("auth")} />;
}