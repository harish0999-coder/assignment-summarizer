import React, { useState } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import AnalyzePage from "./pages/AnalyzePage.jsx";

export default function App() {
  const [page, setPage] = useState("landing");

  return page === "landing"
    ? <LandingPage onEnter={() => setPage("analyze")} />
    : <AnalyzePage onBack={() => setPage("landing")} />;
}
