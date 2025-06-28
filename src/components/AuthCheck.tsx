"use client"

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { authUser, loading, justSignedOut, setJustSignedOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    
    if (!authUser) {
      if (justSignedOut) {
        router.push('/'); // send to homepage after sign out
      } else if (pathname !== '/') {
        router.push('/login'); // normal redirect to login
      }
    }
  }, [authUser, loading, justSignedOut, router, pathname, setJustSignedOut]);

  if (loading) return <p className='h-[85vh] flex items-center justify-center text-lg font-semibold'>로딩 중...</p>;
  if (!authUser && pathname !== '/') return null;

  return <>{children}</>;
}
