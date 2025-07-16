'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { KakaoLoginButton } from '@/components/layoutSections/KakaoLoginButton';
import { ensureUserProfile } from '@/components/HelperFunctions';
import { toast } from 'sonner'; 

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/generate';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('login');

  const afterLoginRedirect = async () => {
    await router.push(redirect);
  };

  // const googleLogin = async () => {
  //   try {
  //     sessionStorage.setItem('googleLoginAttempted', 'true');
  //     const provider = new GoogleAuthProvider();

  //     await signInWithRedirect(auth, provider);
  //   } catch (err: any) {
  //     console.error("Error initiating Google redirect login:", err);
  //     sessionStorage.removeItem('googleLoginAttempted');
  //     toast.error(err.message || 'Google 로그인 리디렉션 시작 중 오류가 발생했습니다.');
  //   }
  // };
 
  // useEffect(() => {
  //   const handleRedirectResultOnLoad = async () => {
  //     const loginAttempted = sessionStorage.getItem('googleLoginAttempted');
  //     if (!loginAttempted) return; // don't run unless user clicked login

  //     // Clear the flag so this only runs once
  //     sessionStorage.removeItem('googleLoginAttempted');

  //     setWaiting(true)
  //     try {
  //       const result = await getRedirectResult(auth); // <--- KEY: Get the result after redirect   
  //       if (result) {
  //         await ensureUserProfile(result.user, name);
  //         await afterLoginRedirect();
  //       } else {
  //         toast.error('Google 로그인에 실패했습니다. 사용자 정보를 가져올 수 없습니다.');
  //       }
  //     } catch (error: any) {
  //       console.error("Error during Google redirect sign-in:", error);
  //       if (error.code === 'auth/cancelled-pop-up' || error.code === 'auth/popup-closed-by-user') {
  //         toast.error('Google 로그인 리디렉션이 사용자 또는 브라우저에 의해 취소되었습니다.');
  //       } else if (error.code === 'auth/auth-domain-config-error') {
  //         toast.error('Firebase 인증 도메인 설정 오류: Firebase 콘솔에서 웹 도메인을 확인하세요.');
  //       } else if (error.code === 'auth/credential-already-in-use') {
  //         toast.error('이미 다른 방식으로 가입된 이메일입니다. 다른 로그인 방법을 사용하거나 기존 계정으로 로그인해주세요.');
  //       }
  //       else {
  //         toast.error(error.message || 'Google 로그인 중 알 수 없는 오류가 발생했습니다.');
  //       }
  //     } finally {
  //       setWaiting(false)
  //     }
  //   };

  //   handleRedirectResultOnLoad(); 
  // }, [auth, ensureUserProfile, afterLoginRedirect]);

  const emailSignup = async () => {
    try {
      if (!name) {
        toast.error('성함을 입력해 주세요.');
        return
      }
      if (!email) {
        toast.error('이메일을 입력해 주세요.');
        return
      }
      if (!password) {
        toast.error('비밀번호를 입력해 주세요.');
        return
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (result.user) {
        await ensureUserProfile(result.user, name, window.location.href);
        await afterLoginRedirect();
      } else {
        toast.error('회원가입에 실패했습니다. 사용자 정보를 생성할 수 없습니다.');
      }
    } catch (err: any) {
      toast.error(err.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const emaillogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result.user) {
        await ensureUserProfile(result.user, name, window.location.href);
        await afterLoginRedirect();
      } else {
        toast.error('로그인에 실패했습니다. 사용자 정보를 가져올 수 없습니다.');
      }
    } catch (err: any) {
      toast.error(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='h-[85vh] flex sm:items-center justify-center bg-primary'>
      <div className="h-fit bg-white w-xs my-24 sm:w-md mx-auto p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'signup' ? '회원가입' : '로그인'}
        </h2>

        {/* <div className=''>
          <button
            onClick={googleLogin}
            className="mx-auto flex gap-2 justify-center items-center w-4/5 mb-4 text-dark border border-dark py-2 rounded-3xl hover:scale-103 transform transition-transform duration-200"
          >
            <img alt="googlelogo" src="/icons/google-icon.svg" className="h-[1rem]" />
            Google 계정으로 계속하기
          </button>
        </div> */}
        <div className='pb-[2rem] border-b border-gray-500'>
          <KakaoLoginButton />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
             if (mode === 'signup') {
              emailSignup();
            } else {
              emaillogin();
            }
          }}
          className="pt-[3rem] mb-4 flex flex-col items-center"
        >
          {mode === 'signup' ? (
            <input
              type="text"
              placeholder="성함"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:w-4/5 px-4 py-2 mb-2 border rounded-full"
              required
            />
          ):(
            ""
          )}
          <input
            type="email"
            placeholder="이메일"
            className="w-full sm:w-4/5 py-2 px-4 border rounded-3xl mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full sm:w-4/5 py-2 px-4 border rounded-3xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-center mt-4 w-full">
            <button
              type="submit"
              className="mx-auto w-full sm:w-4/5 bg-dark hover:opacity-90 text-white py-2 rounded-3xl hover:scale-103 transform transition-transform duration-200"
            >
              {mode === 'signup' ? '이메일로 회원가입' : '이메일로 로그인'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center">
          {mode === 'signup' ? '이미 계정이 있나요? ' : '계정이 없나요? '}
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup');
            }}
            className="text-gray-600 underline hover:scale-103 transform transition-transform duration-200"
          >
            {mode === 'signup' ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  );
}