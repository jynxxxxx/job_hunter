'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { CircleUserRound } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import headerStyles from "@/styles/layout.module.scss";

const Header = () => {
  const { activePage, setActivePage } = useUserData()
  const router = useRouter();
  const pathname = usePathname();
  const { setJustSignedOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    <div className={`fixed bg-white w-full border-b border-gray-300 top-0 left-0 z-50 h-[6rem] md:h-[4rem] font-bold text-dark flex flex-col items-center md:flex-row`}>
      <div className="pt-4 text-[1.7rem] px-6 md:px-[2.5rem] md:pt-0 cursor-pointer" onClick={() => router.push('/')}>
        <img
          src="/logo.png"
          alt="바로지원"
          className='h-[2rem] md:h-[3rem]'
        />
      </div>

      <div className={`w-full pt:12 flex 'justify-center md:justify-start'}`}>
        {pathname === '/login' ? null : (
          <>
            {pathname === '/' && !isAuthenticated && (
              <div
                onClick={handleLoginClick}
                className="ml-auto text-aligntext-[1rem] md:text-[1.3rem] pr-[1rem] font-semibold hover:underline cursor-pointer md:mr-[1rem]"
              >
                로그인
              </div>
            )}

            {isAuthenticated && pathname !== '/login' && (
              <>
                <div
                  onClick={() => {
                    if (pathname !== '/dashboard') {
                      router.push('/dashboard');
                    }
                    setActivePage("generation");
                  }}
                  className={`px-6 py-1 cursor-pointer ${
                    activePage === 'generation' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span>AI 자기소개서</span>
                </div>
                <div
                  onClick={() => {
                    if (pathname !== '/dashboard') {
                      router.push('/dashboard');
                    }
                    setActivePage("history")
                  }}
                  className={`px-6 py-1 cursor-pointer ${
                    activePage === 'history' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span>내 자기소개서</span>
                </div>

                <div className="pr-[1rem] absolute top-4 right-2 md:top-[1rem] md:right-[1rem]" ref={dropdownRef}  onClick={() => setIsDropdownOpen(prev => !prev)}>
                  <CircleUserRound size={28} className="hover:scale-110"/>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <div
                        onClick={handleLogoutClick}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        로그아웃
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
