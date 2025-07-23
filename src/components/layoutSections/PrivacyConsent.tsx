// components/PrivacyAgreementModal.tsx

import { useEffect, useState } from 'react';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // assumes you use a custom hook
import { db } from '@/lib/firebase';
import PrivacyPolicy from './PrivacyForm';

export default function PrivacyAgreementModal() {
  const { authUser } = useAuth(); // must return firebase.User | null
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const checkAgreement = async () => {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data()?.agreedToPrivacy) {
        setShowModal(true);
      }

      setChecking(false);
    };

    checkAgreement();
  }, [authUser]);

  const handleAgree = async () => {
    if (!authUser) return;

    const userRef = doc(db, 'users', authUser.uid);
    await setDoc(userRef, { agreedToPrivacy: serverTimestamp()  }, { merge: true });

    setShowModal(false);
  };

  if (checking || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-fit h-fit p-6 rounded-xl shadow-lg text-sm">
        <h2 className="text-lg font-semibold mb-4">개인정보 처리방침 동의</h2>
        <div className="h-[40vh] overflow-y-auto border p-2 text-gray-700 text-xs mb-4">
          <PrivacyPolicy />
        </div>
        <button
          onClick={handleAgree}
          className="bg-bright text-white text-lg px-4 py-2 rounded hover:brightness-90 w-full"
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}
