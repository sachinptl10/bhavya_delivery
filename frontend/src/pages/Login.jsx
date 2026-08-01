import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import ModernLoginSignup from '../components/ui/modern-login-signup';

export const Login = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'auth_failed') {
      toast.error('Authentication failed. Please try again.');
    }
  }, [location]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <ModernLoginSignup />
    </PageTransition>
  );
};
