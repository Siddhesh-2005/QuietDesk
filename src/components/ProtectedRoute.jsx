import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ authentication = true }) {
    const authStatus = useSelector((state) => state.auth.status);
   // const loading = useSelector((state) => state.auth.loading); 

    // If the user needs to be authenticated and they are NOT, redirect to login.
    if (authentication && !authStatus) {
        return <Navigate to="/" replace />;
    } 
    // If the user should NOT be authenticated (e.g., on login page) but they ARE, redirect to home.
    else if (!authentication && authStatus) {
        return <Navigate to="/home" replace />;
    }

    // Otherwise, render the nested route.
    return <Outlet />;
}

export default ProtectedRoute;