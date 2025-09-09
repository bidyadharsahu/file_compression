
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, User } from "firebase/auth";
import { app } from "@/integrations/firebase/client";
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoggedIn: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update user profile with metadata
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        signIn,
        signUp,
        signOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
