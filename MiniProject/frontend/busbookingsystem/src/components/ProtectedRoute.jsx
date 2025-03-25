import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If role is required and user doesn't have it, redirect to home
  if (requiredRole && currentUser.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" />;
  }

  // If authenticated and has required role (or no role required), render children
  return <Outlet />;
};

export default ProtectedRoute; 