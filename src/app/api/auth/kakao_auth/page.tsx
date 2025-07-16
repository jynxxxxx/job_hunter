'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { functions, auth } from '@/lib/firebase';
import { ensureUserProfile } from '@/components/HelperFunctions';
import { DotSpinner } from '@/components/layoutSections/DotSpinner';

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (error) return; // Stop if there was a previous error

    if (code) {
      const processLogin = async () => {
        try {
          const getKakaoUserInfoAndSignIn = httpsCallable(functions, 'getKakaoUserInfoAndSignIn');

          const result: any = await getKakaoUserInfoAndSignIn({
            code: code,
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
          });

          const { customToken, kakaoProfile } = result.data;

          if (customToken) {
            await signInWithCustomToken(auth, customToken);
            
            const currentUser = auth.currentUser;
            if (currentUser) {
              // Now call ensureUserProfile with the currentUser object
              // and the nickname from KakaoProfile.
              await ensureUserProfile(currentUser, kakaoProfile.nickname, window.location.href);

            } else {
              // This case should ideally not happen if signInWithCustomToken succeeds
              console.error("Firebase currentUser is null after signInWithCustomToken.");
              setError("로그인 실패: 사용자 정보 없음");
              return; // Stop execution
            }
            router.push('/generate');
          } else {
            throw new Error("No Firebase token received.");
          }
        } catch (err: any) {
          console.error("Firebase function call failed:", err);
          setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      };

      processLogin();
    } else {
        const errorDescription = searchParams.get('error_description');
        setError(`카카오 로그인 실패. ${errorDescription || '인가 코드가 반환되지 않았습니다.'}`);;
    }
  }, [searchParams, router, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
      <div className="p-8 pb-16 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">로그인 중입니다</h1>
        <DotSpinner />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}