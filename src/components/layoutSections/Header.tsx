'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { CircleUserRound } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import headerStyles from "@/styles/layout.module.scss";
import PrivacyAgreementModal from './PrivacyConsent';
import Image from 'next/image';

const Header = () => {
  const { activePage, setActivePage } = useUserData()
  const router = useRouter();
  const pathname = usePathname();
  const { setJustSignedOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProfileTabOpen, setIsProfileTabOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (pathname === '/revision') {
      setActivePage('revision');
    } else if (pathname.startsWith('/generate')) {
      setActivePage('generation');
    } else if (pathname === '/history') {
      setActivePage('history');
    } else if (pathname === '/copilot') {
      setActivePage('copilot');
    } else if (pathname === '/feedback') {
      setActivePage('feedback');
    } else {
      setActivePage('home');
    }
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !(profileRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsProfileTabOpen(false);
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
    <div 
      className={`fixed bg-white w-full top-0 left-0 h-[5rem] sm:h-[4rem] font-bold text-dark flex flex-col sm:items-center sm:flex-row`}
      style={{ zIndex: 1000 }}
    >
      <div 
        className="pt-2 px-6 md:px-[2.5rem] sm:pt-0 cursor-pointer" 
        onClick={() => {
          router.push('/')
          setActivePage("home");
        }}
      >
        <div className="h-[2.5rem] w-[8rem] relative">
          <Image
            src="/logo.png"
            alt="바로지원"
            fill
            className="object-contain"
          />
        </div>
      </div>

      
      {pathname === '/login' ? null : (
        <div className={`w-full pl-4 sm:pl-0 md:pt:12 flex items-end justify-start gap-4`}>
          <>
            {isAuthenticated && (
              <>
                <div 
                  onClick={() => {
                    if (pathname !== '/generate') {
                      router.push('/generate');
                    }
                    setActivePage("generation")
                  }}
                  className={`w-fit text-sm px-2 md:px-4 py-2 cursor-pointer ${
                    activePage === 'generation' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span><span className='hidden sm:inline'>자기소개서&nbsp;</span>생성</span>
                </div>
                <div 
                  onClick={() => {
                    if (pathname !== '/revision') {
                      router.push('/revision');
                    }
                    setActivePage("revision")
                  }}
                  className={`w-fit text-sm px-2 md:px-4 py-2 cursor-pointer ${
                    activePage === 'revision' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span><span className='hidden sm:inline'>자기소개서&nbsp;</span>첨삭</span>
                </div>
                <div 
                  onClick={() => {
                    if (pathname !== '/feedback') {
                      router.push('/feedback');
                    }
                    setActivePage("feedback")
                  }}
                  className={`w-fit text-sm px-2 md:px-4 py-2 cursor-pointer ${
                    activePage === 'feedback' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span><span className='hidden sm:inline'>페르소나&nbsp;</span>피드백 (Beta)</span>
                </div>
                <div
                  onClick={() => {
                    if (pathname !== '/history') {
                      router.push('/history');
                    }
                    setActivePage("history")
                  }}
                  className={`w-fit text-sm px-2 md:px-4 py-2 cursor-pointer ${
                    activePage === 'history' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                  }`}
                >
                  <span><span className='hidden sm:inline'>자기소개서&nbsp;</span>기록</span>
                </div>
              </>
            )}
            <div 
              onClick={() => {
                if (pathname !== '/copilot') {
                  router.push('/copilot');
                }
                setActivePage("copilot")
              }}
              className={`w-fit text-sm px-2 md:px-4 py-2 cursor-pointer ${
                activePage === 'copilot' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
              }`}
            >
              <span>컨설팅<span className='hidden sm:inline'>&nbsp;서비스</span></span>
            </div>
          </>
          {!isAuthenticated ? (
            <div
              onClick={handleLoginClick}
              className="z-[1000] absolute top-6 sm:top-1/2 transform -translate-y-1/2 right-4 md:right-[1rem] text-sm font-semibold hover:scale-110 cursor-pointer"
            >
              로그인
            </div>
          ):(
            <div 
              className="z-[1000] absolute top-6 sm:top-1/2 transform -translate-y-1/2 right-4 md:right-[1rem] text-sm font-semibold hover:scale-110 cursor-pointer" 
              ref={profileRef}  
              onClick={() => setIsProfileTabOpen(prev => !prev)}
            >
              <CircleUserRound size={28} className="hover:scale-110"/>
              {isProfileTabOpen && (
                <div 
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg"
                  style={{zIndex: '1000'}}
                >
                  <div
                    onClick={() => {
                      if (pathname !== '/profile') {
                        router.push('/profile');
                      }
                      setActivePage("home")
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <span>마이 페이지</span>
                  </div> 
                  {/* <div
                    onClick={() => {
                      if (pathname !== '/pricing') {
                        router.push('/pricing');
                      }
                      setActivePage("pricing")
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <span>구독안내</span>
                  </div>  */}
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
      )}

      {isAuthenticated && pathname !== '/login' && pathname !== '/' && (
            <PrivacyAgreementModal />
          )}
      
    </div>
  );
};

export default Header;
