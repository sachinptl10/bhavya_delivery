// Authentication service — all Firebase auth operations live here.
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

// Sign in with a Google popup window.
// Returns the Firebase user object on success.
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign the current user out of Firebase.
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

// Map Firebase error codes to friendly, human-readable messages.
export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before you finished. Please try again.';
    case 'auth/cancelled-popup-request':
    case 'auth/expired-popup-request':
      return 'The sign-in request expired. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection and try again.';
    case 'auth/invalid-api-key':
      return 'Firebase is not configured correctly. Check your API key in frontend/.env.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase authentication. Add it in the Firebase Console.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but a different sign-in method.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
};
