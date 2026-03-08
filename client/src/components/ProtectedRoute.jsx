import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useLoadUserQuery } from '@/features/api/authApi'; // ← add this

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { isLoading } = useLoadUserQuery(); // ← wait for auth check

    // Show spinner while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#143234]">
                <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen bg-[#143234]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;