// path: frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; // Import the Sidebar component

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If the user is not authenticated, redirect them to the landing page.
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If the user IS authenticated, render the main application layout.
    return (
        <div className="flex h-screen bg-[#143234]">
            {/* The Sidebar is now part of the protected layout */}
            <Sidebar />
            
            {/* The Outlet component renders the matched child route (e.g., Dashboard, Warehouse, etc.) */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;
