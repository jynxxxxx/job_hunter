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

const Header = () => {
  const { activePage, setActivePage } = useUserData()
  const router = useRouter();
  const pathname = usePathname();
  const { setJustSignedOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProfileTabOpen, setIsProfileTabOpen] = useState(false);
  const [isGenerateTabOpen, setIsGenerateTabOpen] = useState(false);
  const profileRef = useRef(null);
  const generateRef = useRef(null);

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
      if (
        generateRef.current &&
        !(generateRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsGenerateTabOpen(false);
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
      className={`fixed bg-white w-full border-b border-gray-300 top-0 left-0 sm:h-[4rem] font-bold text-dark flex flex-col sm:items-center sm:flex-row ${isAuthenticated ? "h-[6rem]" : "h-[4rem]"}`}
      style={{ zIndex: 1000 }}
    >
      <div 
        className="pt-4 px-6 md:px-[2.5rem] sm:pt-0 cursor-pointer" 
        onClick={() => {
          router.push('/')
          setActivePage("home");
        }}
      >
        <img
          src="/logo.png"
          alt="바로지원"
          className='h-[2rem] md:h-[3rem] w-auto'
        />
      </div>

      
      {pathname === '/login' ? null : (
        <div className={`w-full mt-2 md:mt-0 pt:12 flex justify-around items-end sm:items-center sm:justify-start`}>
          {isAuthenticated && pathname !== '/login' && (
            <>
              {/* <div
                onClick={() => {
                  if (pathname !== '/revision') {
                    router.push('/revision');
                  }
                  setActivePage("revision");
                }}
                className={`w-fit text-[0.9rem] md:text-[1rem] px-2 md:px-6 py-2 cursor-pointer ${
                  activePage === 'revision' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                }`}
              >
                <span>자기소개서 AI 첨삭</span>
              </div> */}
            <div 
              className={`relative w-fit text-[0.9rem] md:text-[1rem] px-2 md:px-6 py-2 cursor-pointer ${
                  activePage === 'generation' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                }`}
              ref={generateRef}  
              onClick={() => setIsGenerateTabOpen(prev => !prev)}
            >
              <span>AI 자기소개서 생성</span>
              {isGenerateTabOpen && (
                <div
                  className="absolute top-full left-2 w-[150%] flex flex-col bg-white border border-gray-200 rounded shadow-lg"
                >
                  <div
                    onClick={() => {
                      if (pathname !== '/generate') {
                        router.push('/generate/trending');
                      }
                      setActivePage("generation");
                    }}
                    className='py-4 px-8 hover:bg-primary'
                  >
                    핫한 채용공고 자기소개서
                    <p></p>
                  </div>
                  <div
                    onClick={() => {
                      if (pathname !== '/generate') {
                        router.push('/generate/free');
                      }
                      setActivePage("generation");
                    }}
                    className='py-4 px-8 hover:bg-primary/40'
                  >
                    자유항목 공고 자기소개서
                  </div>
                </div>
              )}                
              </div>
              <div
                onClick={() => {
                  if (pathname !== '/history') {
                    router.push('/history');
                  }
                  setActivePage("history")
                }}
                className={`w-fit text-[0.9rem] md:text-[1rem] px-2 md:px-6 py-2 cursor-pointer ${
                  activePage === 'history' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                }`}
              >
                <span>내 자기소개서</span>
              </div>
              {/* <div
                onClick={() => {
                  if (pathname !== '/tokens') {
                    router.push('/tokens');
                  }
                  setActivePage("tokens")
                }}
                className={`text-[0.9rem] md:text-[1rem] px-2 md:px-6 py-2 cursor-pointer ${
                  activePage === 'tokens' ? `${headerStyles.active}` : `${headerStyles.underlineAnimate}`
                }`}
              >
                <span>토큰 충전</span>
              </div> */}
              {/* <div className='text-[1rem] lg:text-[1.2rem] pr-[5rem] absolute top-4 right-2 text-bright'> 
                토큰수: {userData?.tokens && (userData?.tokens> 0) ? userData?.tokens : 0 }
              </div> */}
            </>
          )}
          {!isAuthenticated ? (
            <div
              onClick={handleLoginClick}
              className="z-[1000] absolute top-4 right-6 md:top-[1rem] md:right-[1rem] text-[1rem] md:text-[1.5rem] pr-[1rem] font-semibold hover:scale-110 cursor-pointer"
            >
              로그인
            </div>
          ):(
            <div 
              className="z-[1000] absolute top-4 right-6 md:top-[1rem] md:right-[1rem]" 
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
