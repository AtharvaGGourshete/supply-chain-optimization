// src/components/ProtectedRoute.jsx (NEW FILE)
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Get the auth state from Redux
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Show a loading/placeholder screen while the user data is being fetched on initial load.
    // NOTE: This assumes you handle the initial loading state in App.jsx (see below).
    // For now, we'll assume the loadUser is running in App.jsx.

    if (!isAuthenticated) {
        // Redirect to the login/register page if not authenticated
        return <Navigate to="/register" replace />;
    }

    // If authenticated, render the nested route component
    return <Outlet />;
};

export default ProtectedRoute;