// path: frontend/src/App.jsx
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useLoadUserQuery } from "./features/api/authApi";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import WarehouseSetupPage from "./pages/WarehouseSetupPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";
import Documentation from "./pages/Documentation";
import Profile from "./pages/Profile";
import SupplierSelection from './pages/SupplierSelectionPage';
import { Toaster } from "./components/ui/sonner";

const AppContent = () => {
    const { isLoading } = useLoadUserQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#143234]">
                <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
                <p className="text-lg text-gray-300 mt-4">Loading Session...</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/warehouse" element={<WarehouseSetupPage />} />
                <Route path="/optimize-routes" element={<RouteOptimizationPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/supplier-selection" element={<SupplierSelection />} />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
            <Toaster richColors/>
        </Provider>
    );
}

export default App;
