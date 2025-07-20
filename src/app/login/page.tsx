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
import LoginForm from '@/components/layoutSections/LoginForm';

export default function LoginPage() {

  return (
    <div className='h-[85vh] flex sm:items-center justify-center bg-primary'>
      <div className="h-fit bg-white w-xs my-24 sm:w-md mx-auto p-4 border rounded-md shadow-md">
      <LoginForm />
      </div>
    </div>
  );
}