import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

  // Wait for Firebase to restore the session before deciding where to redirect.
  if (loading) {
    return <Loading fullScreen label="Checking your session..." />;
  }

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
