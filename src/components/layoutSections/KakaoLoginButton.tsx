'use client';

import React from 'react';
import { toast } from 'sonner';
// This button initiates the Kakao login process by redirecting the user.
export function KakaoLoginButton() {
  const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  const handleLogin = () => {
    if (!window.Kakao) {
      toast.error("Kakao SDK is not loaded.");
      return;
    }
    // Ensure Kakao is initialized
    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
    }

    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="h-10 bg-[#FEE523] overflow-hidden mx-auto flex gap-2 justify-center items-center w-4/5 mb-4 text-dark border border-dark rounded-3xl hover:scale-103 transform transition-transform duration-200"
    >
      <img
        src="/kakao_login.png"
        alt="바로지원"
        className='object-cover object-center sm:h-[3.5rem] w-auto'
      />
    </button>
  );
}
