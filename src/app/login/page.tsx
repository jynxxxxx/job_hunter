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

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className="bg-white w-md mx-auto my-28 p-4 border rounded-md shadow-md">
        <h2 className="text-2xl pb-4 font-bold mb-6 border-b border-gray-300 text-center">
          로그인
        </h2>
        <div className='pb-[2rem] '>
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}