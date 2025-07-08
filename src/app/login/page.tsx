'use client';

import { KakaoLoginButton } from '@/components/layoutSections/KakaoLoginButton';


export default function AuthForm() {

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className="bg-white w-3/4 sm:w-md mx-auto my-28 p-4 border rounded-md shadow-md">
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