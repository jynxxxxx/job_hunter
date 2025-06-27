'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setJustSignedOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogoutClick = async () => {
    setJustSignedOut(true);
    await signOut(auth);
    console.log('logging out')
    await router.push('/');
  };

  // const textColor =
  //   pathname === '/login'
  //     ? 'text-white'
  //     : '' 

  return (
    <div className={`absolute w-full top-0 left-0 z-50 h-[4rem] font-bold text-dark flex items-center justify-between`}>
      <div className="text-[1.7rem] pl-[2rem] cursor-pointer" onClick={() => router.push('/')}>
        바로지원
      </div>

    {pathname === '/' ? (
      isAuthenticated ? (
        <div
          onClick={() => router.push('/dashboard')}
          className="text-[1.3rem] pr-[2rem] font-semibold hover:underline cursor-pointer"
        >
          대시보드
        </div>
      ) : (
        <div
          onClick={handleLoginClick}
          className="text-[1.3rem] pr-[2rem] font-semibold hover:underline cursor-pointer"
        >
          로그인
        </div>
      )
    ) : (
      pathname === '/login' ? (
        <div> </div>
      ):(
        <div
          onClick={handleLogoutClick}
          className="text-[1rem] pr-[2rem] font-semibold hover:underline cursor-pointer"
        >
          로그아웃
        </div>
      )
    )}
    </div>
  );
};

export default Header;
