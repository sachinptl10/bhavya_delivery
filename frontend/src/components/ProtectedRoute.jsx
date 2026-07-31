import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    // Not logged in, redirect to user login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Logged in but not an admin, redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
