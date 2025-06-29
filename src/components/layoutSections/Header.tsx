'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { CircleUserRound } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';

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
    <div className={`absolute w-full top-0 left-0 z-50 h-[5rem] md:h-[4rem] font-bold text-dark flex flex-col items-center justify-between md:flex-row`}>
      <div className="pt-[0.5rem] text-[1.7rem] pl-4 md:pl-[2rem] cursor-pointer" onClick={() => router.push('/')}>
        <img
          src="/logo.png"
          alt="바로지원"
          className='h-[2.5rem] md:h-[3.5rem]'
        />
      </div>

      <div className={`w-full pt:12 flex md:w-2/5 md:mr-[4rem] lg:w-3/10 ${pathname === '/' ? 'justify-end' : 'justify-around'}`}>
        {pathname === '/' && (
          isAuthenticated ? (
            <div
              onClick={() => router.push('/dashboard')}
              className="text-[1rem] md:text-[1.3rem] pr-[2rem] font-semibold hover:underline cursor-pointer"
            >
              대시보드
            </div>
          ) : (
            <div
              onClick={handleLoginClick}
              className="text-aligntext-[1rem] md:text-[1.3rem] pr-[2rem] font-semibold hover:underline cursor-pointer md:mr-[-2rem]"
            >
              로그인
            </div>
          )
        )}

        {pathname === '/login' && ( <div> </div> ) }

        {pathname === '/dashboard' && (
          <>
            <div
              onClick={()=> {setActivePage("generation")}}
              className={`text-[1rem] md:text-[1rem] cursor-pointer py-2 px-6 ${activePage === 'generation' ? 'font-extrabold bg-gray-200 rounded-4xl' : 'font-semibold hover:underline hover:scale-105 '}`}
            >
              맞춤 자기소개서 시작
            </div>
            <div
              onClick={()=> {setActivePage("history")}}
              className={`text-[1rem] md:text-[1rem] cursor-pointer py-2 px-6 ${activePage === 'history' ? 'font-extrabold bg-gray-200 rounded-4xl' : 'font-semibold hover:underline hover:scale-105 '}`}
            >
              내 자기소개서 보기
            </div>
          </>
        )}

        {isAuthenticated && pathname !== '/login' && (
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
          )}  
      </div>
    </div>
  );
};

export default Header;
