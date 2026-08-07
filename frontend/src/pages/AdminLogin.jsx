import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

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
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-md sm:bg-gray-800 sm:shadow-2xl sm:border border-gray-700 rounded-2xl p-4 sm:p-10 text-center transition-all">
          <div className="mb-10 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 sm:bg-gray-700 text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm rotate-3 border border-gray-700">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 -rotate-3 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-gray-400 mt-3 text-base sm:text-lg">Authorized personnel only.</p>
          </div>
          
          <Button 
            onClick={handleAdminGoogleLogin} 
            className="w-full py-4 rounded-xl flex items-center justify-center gap-4 text-lg font-semibold bg-white text-gray-900 border-2 hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Continue with Google
          </Button>
          
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Customer looking to track?{' '}
              <Link to="/login" className="text-gray-300 hover:text-white font-semibold hover:underline">
                Go to Customer Portal
              </Link>
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
