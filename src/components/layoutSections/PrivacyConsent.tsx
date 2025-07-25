// components/PrivacyAgreementModal.tsx

import { useEffect, useState } from 'react';
import { 
  getDoc,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
 } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // assumes you use a custom hook
import { db } from '@/lib/firebase';
import PrivacyPolicy from './PrivacyForm';
import { toast } from 'sonner';

export default function PrivacyAgreementModal() {
  const { authUser } = useAuth(); // must return firebase.User | null
  const [step, setStep] = useState<'form' | 'policy'>('form');
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    phoneNumber: "",
    schoolName: '',
    graduationStatus: '',
    major: '',
    referralCode: '',
  });

  const handleNext = async() => {
    if (!authUser) return;

    if (!form.schoolName || !form.graduationStatus || !form.major || !form.phoneNumber) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }

    const digitsOnly = form.phoneNumber.replace(/\D/g, '');

    if (digitsOnly.length < 11) {
      toast.error('전화번호는 최소 11자리 숫자여야 합니다.');
      return
    }

    const referralCode = form.referralCode?.trim().toUpperCase();;

    if (referralCode) {
      const referralCodeRef = doc(db, 'referral_codes', referralCode);
      const referralCodeSnap = await getDoc(referralCodeRef);

      if (referralCodeSnap.exists()) {
        const refData = referralCodeSnap.data();

        // prevent self-referral
        if (refData.ownerId !== authUser.uid) {
          await updateDoc(referralCodeRef, {
            referralCount: increment(1),
            referredUserIds: arrayUnion(authUser.uid),
          });
        } 
      } else {
        toast.error('추천코드가 유효하지 않습니다.');
        return
      }
    }

    setStep('policy');
  };


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

    await setDoc(
      userRef,
      {
        agreedToPrivacy: serverTimestamp(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
        school: {
          name: form.schoolName,
          major: form.major,
          graduated: form.graduationStatus,
        },
        referredBy: form.referralCode.trim().toUpperCase() || null,
      },
      { merge: true }
    );
    setShowModal(false);
  };

  if (checking || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-9/10 max-w-2xl h-fit p-6 rounded-xl shadow-lg text-sm">
        {step === 'form' && (
          <>
            <h2 className="text-lg font-semibold mb-4">기본 정보 입력</h2>
            <div className="space-y-3 text-gray-700 text-sm">
              <div>
                <label className="block mb-1">전화번호</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">학교 이름</label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">전공</label>
                <input
                  type="text"
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">졸업 상태</label>
                <select
                  value={form.graduationStatus}
                  onChange={(e) => setForm({ ...form, graduationStatus: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">선택</option>
                  <option value="재학중">재학중</option>
                  <option value="졸업예정">졸업예정</option>
                  <option value="졸업">졸업</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">친구 추천코드 (선택)</label>
                <input
                  type="text"
                  value={form.referralCode}
                  onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-bright text-white text-lg px-4 py-2 rounded hover:brightness-90"
            >
              다음
            </button>
          </>
        )}

        {step === 'policy' && (
          <>
            <h2 className="text-lg font-semibold mb-4">개인정보 처리방침 동의</h2>
            <div className="h-[40vh] md:h-[70vh] overflow-y-auto border p-2 text-gray-700 text-xs mb-4">
              <PrivacyPolicy />
            </div>
            <button
              onClick={handleAgree}
              className="bg-bright text-white text-lg px-4 py-2 rounded hover:brightness-90 w-full"
            >
              동의하고 계속하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
