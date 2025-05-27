import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import AgentDetails from "./pages/dashboard/AgentDetails";
import KnowledgeBaseDetails from "./pages/dashboard/KnowledgeBaseDetails";
import ToolDetails from "./pages/dashboard/ToolDetails";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard/agents" /> : <>{children}</>;
}

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Redirect /dashboard to /dashboard/agents */}
          <Route index element={<Navigate to="/dashboard/agents" replace />} />
          <Route
            path="agents/*"
            element={<Navigate to="/dashboard/agents" replace />}
          />
          <Route
            path="phones"
            element={<Navigate to="/dashboard/phones" replace />}
          />
          <Route
            path="calls"
            element={<Navigate to="/dashboard/calls" replace />}
          />
          <Route
            path="knowledge"
            element={<Navigate to="/dashboard/knowledge" replace />}
          />
          <Route
            path="tools"
            element={<Navigate to="/dashboard/tools" replace />}
          />
          <Route
            path="batch-calling"
            element={<Navigate to="/dashboard/batch-calling" replace />}
          />
        </Route>

        {/* Individual routes */}
        <Route
          path="/dashboard/agents/:agentId"
          element={
            <PrivateRoute>
              <AgentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/knowledge/:documentId"
          element={
            <PrivateRoute>
              <KnowledgeBaseDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/tools/:toolId"
          element={
            <PrivateRoute>
              <ToolDetails />
            </PrivateRoute>
          }
        />

        {/* Redirect authenticated users to dashboard/agents */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/dashboard/agents" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;