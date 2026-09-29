import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./auth/useAuth";
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import { Toaster } from "react-hot-toast";
import DashboardPage from "./Pages/DashboardPage";
import ProblemPage from "./Pages/ProblemPage";
import ProblemsPage from "./Pages/ProblemsPage";
import SessionPage from "./Pages/SessionPage";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="auth-loading" role="status">Loading...</div>;

  return (
    <div>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="/problems" element={isAuthenticated ? <ProblemsPage /> : <Navigate to="/login" replace />} />
        <Route path="/problem/:id" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" replace />} />
        <Route path="/session/:id" element={isAuthenticated ? <SessionPage /> : <Navigate to="/login" replace />} />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  )
}

export default App