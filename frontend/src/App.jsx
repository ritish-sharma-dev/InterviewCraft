import React from 'react'
import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from './Pages/HomePage'
import DashboardPage from "./Pages/DashboardPage";
import ProblemPage from "./Pages/ProblemPage";
import ProblemsPage from "./Pages/ProblemsPage";
import SessionPage from "./Pages/SessionPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>
    </div>
  )
}

export default App