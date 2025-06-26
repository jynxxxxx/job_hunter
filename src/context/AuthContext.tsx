"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

type AuthContextType = { 
  authUser: User | null; 
  loading: boolean; 
  justSignedOut: boolean;
  setJustSignedOut: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  justSignedOut: false,
  setJustSignedOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [justSignedOut, setJustSignedOut] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      setAuthUser(authUser);
      setLoading(false);
      if (authUser) setJustSignedOut(false); // reset flag if user logs in
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, loading, justSignedOut, setJustSignedOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
