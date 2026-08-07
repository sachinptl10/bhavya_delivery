import React, { useEffect } from 'react';
import { useLocation, Navigate, Link } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';

export const Login = () => {
  const location = useLocation();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'auth_failed') {
      toast.error('Authentication failed. Please try again.');
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white dark:bg-[var(--color-bg)] sm:bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        
        {/* On mobile, we remove the card borders/shadows to make it feel like a native app screen */}
        <div className="w-full max-w-md sm:bg-white sm:dark:bg-[var(--color-card)] sm:shadow-xl sm:border border-[var(--color-border)] rounded-2xl p-4 sm:p-10 text-center transition-all">
          
          <div className="mb-10 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 -rotate-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] tracking-tight">Welcome Back</h2>
            <p className="text-[var(--color-muted)] mt-3 text-base sm:text-lg">Sign in to manage your shipments and track your deliveries.</p>
          </div>
          
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline" 
            className="w-full py-4 rounded-xl flex items-center justify-center gap-4 text-lg font-semibold bg-white dark:bg-slate-800 border-2 hover:bg-gray-50 hover:border-[var(--color-primary)] transition-all shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Continue with Google
          </Button>
          
          <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)]">
              Authorized personnel?{' '}
              <Link to="/admin/login" className="text-[var(--color-primary)] hover:text-blue-600 font-semibold hover:underline">
                Go to Admin Portal
              </Link>
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
