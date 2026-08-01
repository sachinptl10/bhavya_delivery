import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Error } from '../components/Error';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

export const Login = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { signIn, loading, error } = useGoogleSignIn();

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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--color-bg)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">Customer Portal</h2>
            <p className="text-[var(--color-muted)] mt-2">Sign in to manage your shipments.</p>
          </div>

          {error && (
            <div className="mb-6 text-left">
              <Error message={error} onRetry={signIn} />
            </div>
          )}

          <Button
            onClick={signIn}
            variant="outline"
            isLoading={loading}
            disabled={loading}
            className="w-full py-3 sm:py-4 flex items-center justify-center gap-3 text-base sm:text-lg"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <p className="mt-8 text-sm text-gray-400">
            Are you an administrator?{' '}
            <Link to="/admin/login" className="text-[var(--color-accent)] hover:underline">
              Go to Admin Portal
            </Link>
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};
