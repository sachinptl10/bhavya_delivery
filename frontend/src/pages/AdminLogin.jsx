import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'auth_failed') {
      toast.error('Admin authentication failed. Your email may not be whitelisted.');
    }
  }, [location]);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  if (user && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAdminGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google/admin`;
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 text-center bg-gray-800 border-gray-700 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
            <p className="text-gray-400 mt-2">Authorized personnel only.</p>
          </div>
          
          <Button 
            onClick={handleAdminGoogleLogin} 
            className="w-full py-4 flex items-center justify-center gap-3 text-lg bg-white text-gray-900 hover:bg-gray-100"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Sign in with Google (Admin)
          </Button>
          
        </Card>
      </div>
    </PageTransition>
  );
};
