import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CivicAuthProvider, useUser } from "@civic/auth/react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";

function AppRoutes() {
  const { user, isLoading, authStatus, error } = useUser();

  // Debug logging for authentication state
  console.log("🔍 Auth State:", {
    user: user ? "authenticated" : "not authenticated",
    isLoading,
    authStatus,
    error: error?.message,
  });

  // Show loading spinner while authentication is in progress
  if (isLoading || authStatus === "authenticating") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Authenticating...</p>
          <p className="text-zinc-400 text-sm">
            Please wait while we sign you in
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-lg mb-4">Authentication Error</div>
          <p className="text-zinc-400 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

function App() {
  const clientId = import.meta.env.VITE_CIVIC_CLIENT_ID;

  if (!clientId) {
    console.error("VITE_CIVIC_CLIENT_ID is required");
    return <div>Configuration error: Missing Civic Client ID</div>;
  }

  return (
    <>
      <CivicAuthProvider clientId={clientId}>
        <AppRoutes />
      </CivicAuthProvider>
      <Toaster />
    </>
  );
}

export default App;
