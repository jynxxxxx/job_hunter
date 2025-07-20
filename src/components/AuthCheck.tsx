"use client"

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { authUser, loading, justSignedOut, setJustSignedOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString(); 
  const fullPath = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    if (loading) return;
    
    if (!authUser) {
      if (justSignedOut) {
        router.push('/'); // send to homepage after sign out
      } else if (pathname !== '/') {
        localStorage.setItem('postLoginRedirect', fullPath);
        router.push('/login'); // normal redirect to login
      }
    }
  }, [authUser, loading, justSignedOut, router, pathname, setJustSignedOut]);

  if (loading) return <p className='h-[85vh] flex items-center justify-center text-lg font-semibold'>로딩 중...</p>;
  if (!authUser && pathname !== '/') return null;

  return <>{children}</>;
}
