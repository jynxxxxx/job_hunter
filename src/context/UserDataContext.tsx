"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import type { CustomUserProfile } from '@/types/user'
import { convertFirebaseTimestamp } from '@/components/HelperFunctions';

type UserDataContextType = {
  userData: CustomUserProfile | null;
  setUserData: React.Dispatch<React.SetStateAction<CustomUserProfile | null>>;
  loadingUserData: boolean;
  refetchUserData: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  jobList: any[];
  jobTemplates: any[];
};

type ActivePage = 'generation' | 'history' | 'home' | 'revision' | 'pricing' | 'copilot' | 'feedback';

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  setUserData: () => {},
  loadingUserData: false,
  refetchUserData: () => {},
  activePage: 'generation',
  setActivePage: () => {},
  jobList: [],
  jobTemplates: []
});

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const [userData, setUserData] = useState<CustomUserProfile | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [jobList, setJobList] = useState<any[]>([]);
  const [jobTemplates, setJobTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      // If jobs_dictionary is a collection:
      const snapshot = await getDocs(collection(db, "jobs_dictionary"));
      const jobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          startDate: data.startDate ? convertFirebaseTimestamp(data, "startDate", 'short') : undefined,
          endDate: data.endDate ? convertFirebaseTimestamp(data, "endDate", 'short') : undefined,
        };
      });
      setJobList(jobs);
    };
    fetchJobs();
  }, [authUser?.uid]);

  useEffect(() => {
    const fetchTemplates = async () => {
      // If jobs_dictionary is a collection:
      const snapshot = await getDocs(collection(db, "job_templates"));
      const templates = snapshot.docs.map(doc => doc.data());
      setJobTemplates(templates);
    };
    fetchTemplates();
  }, [authUser?.uid]);

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
          resumeUploadDate: convertFirebaseTimestamp(data, "resumeUploadDate"),
        };
        setUserData(updatedData);
      } else {
        setUserData(data);
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
    <UserDataContext.Provider value={{ userData, setUserData, loadingUserData, refetchUserData: fetchUserData, activePage, setActivePage, jobList, jobTemplates }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
