// src/App.jsx (UPDATED)
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import WarehouseSetupPage from "./pages/WarehouseSetupPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";
import Dashboard from "./pages/Dashboard";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import Documentation from "./pages/Documentation";
import ProtectedRoute from "./components/ProtectedRoute"; // <--- NEW IMPORT
import { useLoadUserQuery } from "./features/api/authApi"; // <--- NEW IMPORT

// Component to handle initial user loading/session check
const AppContent = () => {
    // This query runs on mount and sends the HTTP-Only cookie to the backend /profile endpoint
    const { isLoading } = useLoadUserQuery();

    if (isLoading) {
        // Optional: Render a full-screen loading spinner while checking the session
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#143234] text-white">
                <p>Loading session...</p>
                {/* <Loader2 className="h-8 w-8 animate-spin" /> */}
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/documentation" element={<Documentation />} />
            
            {/* Protected Routes - only accessible when logged in */}
            <Route element={<ProtectedRoute />}>
                <Route path="/warehouse" element={<WarehouseSetupPage />} />
                <Route path="/optimize-routes" element={<RouteOptimizationPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add /profile route here if needed */}
            </Route>
        </Routes>
    );
};


function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent /> {/* Render the main content wrapper */}
      </Router>
      <Toaster richColors/>
    </Provider>
  );
}

export default App;