'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { KakaoLoginButton } from '@/components/layoutSections/KakaoLoginButton';
import { ensureUserProfile } from '@/components/HelperFunctions';
import { toast } from 'sonner'; 

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('login');


  const afterLoginRedirect = async () => {
    await router.push(redirect);
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        await ensureUserProfile(result.user, name);
        await afterLoginRedirect();
      } else {
        toast.error('Google 로그인에 실패했습니다. 사용자 정보를 가져올 수 없습니다.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google 로그인 중 오류가 발생했습니다.');
    }
  };

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
        await ensureUserProfile(result.user, name);
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
        await ensureUserProfile(result.user, name);
        await afterLoginRedirect();
      } else {
        toast.error('로그인에 실패했습니다. 사용자 정보를 가져올 수 없습니다.');
      }
    } catch (err: any) {
      toast.error(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='h-[85vh] flex items-center justify-center bg-primary'>
      <div className="bg-white w-md mx-auto my-28 p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'signup' ? '회원가입' : '로그인'}
        </h2>

        <div className=''>
          <button
            onClick={googleLogin}
            className="mx-auto flex gap-2 justify-center items-center w-4/5 mb-4 text-dark border border-dark py-2 rounded-3xl hover:scale-103 transform transition-transform duration-200"
          >
            <img alt="googlelogo" src="/icons/google-icon.svg" className="h-[1rem]" />
            Google 계정으로 계속하기
          </button>
        </div>
        <div className='pb-[2rem] border-b border-gray-500'>
          <KakaoLoginButton />
        </div>
        <div className="pt-[3rem] mb-4 flex flex-col items-center">
          {mode === 'signup' ? (
            <input
              type="text"
              placeholder="성함"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-4/5 px-4 py-2 mb-2 border rounded-full"
              required
            />
          ):(
            ""
          )}
          <input
            type="email"
            placeholder="이메일"
            className="w-4/5 py-2 px-4 border rounded-3xl mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-4/5 py-2 px-4 border rounded-3xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-center">
          {mode === 'signup' ? (
            <button
              onClick={emailSignup}
              className="mx-auto w-4/5 bg-dark hover:opacity-90 text-white py-2 rounded-3xl hover:scale-103 transform transition-transform duration-200"
            >
              이메일로 회원가입
            </button>
          ) : (
            <button
              onClick={emaillogin}
              className="mx-auto w-4/5 bg-dark hover:opacity-90 text-white py-2 rounded-3xl hover:scale-103 transform transition-transform duration-200"
            >
              이메일로 로그인
            </button>
          )}
        </div>

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