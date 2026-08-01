// Global authentication context.
// - Regular users sign in with Firebase Google popup (session persists across refreshes).
// - Admins still use the backend Google OAuth session (checked via /auth/me).
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signInWithGoogle, signOutUser } from '../services/authService';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Map a Firebase user into the shape the rest of the app expects.
const toUser = (firebaseUser) => ({
  uid: firebaseUser.uid,
  name: firebaseUser.displayName || 'Google User',
  email: firebaseUser.email || '',
  picture: firebaseUser.photoURL || '',
  role: 'user',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Tracks the current Firebase user so the backend session check
  // never overwrites a freshly signed-in Firebase user.
  const firebaseUserRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (cancelled) return;

      firebaseUserRef.current = firebaseUser;

      if (firebaseUser) {
        // Firebase session restored (or just created) — persist user automatically.
        setUser(toUser(firebaseUser));
        setLoading(false);
        return;
      }

      // No Firebase user — check for an existing backend admin session.
      api
        .get('/auth/me')
        .then(({ data }) => {
          if (!cancelled && !firebaseUserRef.current) setUser(data);
        })
        .catch(() => {
          if (!cancelled && !firebaseUserRef.current) setUser(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Sign in with a Google popup via Firebase.
  const login = async () => {
    const firebaseUser = await signInWithGoogle();
    setUser(toUser(firebaseUser));
    toast.success(`Welcome, ${firebaseUser.displayName || 'friend'}!`);
    return firebaseUser;
  };

  // Sign out of Firebase and clear the backend session cookie.
  const logout = async () => {
    try {
      await signOutUser();
      await api.post('/auth/logout').catch(() => {});
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
