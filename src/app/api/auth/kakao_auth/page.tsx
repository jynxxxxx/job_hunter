'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { functions, auth } from '@/lib/firebase';
import { ensureUserProfile } from '@/components/HelperFunctions';

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Authenticating with Kakao...');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (error) return; // Stop if there was a previous error

    if (code) {
      const processLogin = async () => {
        try {
          const getKakaoUserInfoAndSignIn = httpsCallable(functions, 'getKakaoUserInfoAndSignIn');

          setMessage('Verifying with server...');
          console.log("Kakao code received:", code);
          console.log("Redirect URI:", process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI);
          const result: any = await getKakaoUserInfoAndSignIn({
            code: code,
            redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
          });
          console.log("result", result.data)
          const { customToken, kakaoProfile } = result.data;

          if (customToken) {
            setMessage('Signing in to Firebase...');
            await signInWithCustomToken(auth, customToken);
            setMessage('Successfully signed in! Redirecting...');
            
            const currentUser = auth.currentUser;
            if (currentUser) {
              // Now call ensureUserProfile with the currentUser object
              // and the nickname from KakaoProfile.
              await ensureUserProfile(currentUser, kakaoProfile.nickname);
              console.log("ensureUserProfile completed.");
            } else {
              // This case should ideally not happen if signInWithCustomToken succeeds
              console.error("Firebase currentUser is null after signInWithCustomToken.");
              setError("Login failed: User not found after sign-in.");
              setMessage("Error during login. Please try again.");
              return; // Stop execution
            }
            router.push('/dashboard');
          } else {
            throw new Error("No Firebase token received.");
          }
        } catch (err: any) {
          console.error("Firebase function call failed:", err);
          setError(`Authentication failed. Please try again. Details: ${err.message}`);
          setMessage('');
        }
      };

      processLogin();
    } else {
        const errorDescription = searchParams.get('error_description');
        setError(`Kakao login failed. ${errorDescription || 'No authorization code was returned.'}`);
        setMessage('');
    }
  }, [searchParams, router, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login Status</h1>
        {message && <p className="text-gray-600">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}