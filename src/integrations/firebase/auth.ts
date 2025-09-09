import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from './config';
import { toast } from 'sonner';

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    toast.success("Signed in successfully with Google!");
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    toast.error(`Sign in failed: ${error.message}`);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    toast.success("Signed out successfully!");
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(`Sign out failed: ${error.message}`);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
