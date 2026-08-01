// Custom hook that wraps Google sign-in and manages loading + error state.
import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export const useGoogleSignIn = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      return true;
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { signIn, loading, error, clearError };
};
