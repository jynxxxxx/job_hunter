// UserDataProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import type { CustomUserProfile } from '@/types/user'
import { ConvertFirebaseTimestamp } from '@/components/HelperFunctions';

type UserDataContextType = {
  userData: CustomUserProfile | null;
  loadingUserData: boolean;
  refetchUserData: () => void;
};

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loadingUserData: false,
  refetchUserData: () => {},
});

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const [userData, setUserData] = useState<CustomUserProfile | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!authUser?.uid) {
      setUserData(null);
      setLoadingUserData(false);
      return;
    }

    setLoadingUserData(true);

    try {
      const userDocRef = doc(db, 'users', authUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const data = userDocSnap.data() as CustomUserProfile;

      if (userDocSnap.exists() && data.parsedResumeData) {
        const updatedData = {
          ...data,
          parsedResumeData: {
            ...data.parsedResumeData,
            연락처: {
              ...data.parsedResumeData.연락처,
              전화번호: data.parsedResumeData.연락처?.전화번호?.replace(/[()]/g, ''),
            },
          },
          resumeUploadDate: ConvertFirebaseTimestamp(data),
        };
        setUserData(updatedData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user or resume data from Firestore:', error);
      toast.error('데이터를 가져오는 중 오류가 발생했습니다');
      setUserData(null);
    } finally {
      setLoadingUserData(false);
    }
  }, [authUser?.uid]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, loadingUserData, refetchUserData: fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
