"use client"

import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import AuthCheck from "@/components/AuthCheck";

export default function ProfilePage() {
  const {authUser} = useAuth()
  const { userData, refetchUserData } = useUserData()
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    schoolMajor: "",
    graduationStatus: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userData) return;

    setFormState({
      name: userData.name || "",
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      schoolName: userData.school?.name || "",
      schoolMajor: userData.school?.major || "",
      graduationStatus: userData.school?.graduation_status || "",
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!userData || !authUser) return;

    if (formState.phoneNumber !== "") {
      const digitsOnly = formState.phoneNumber.replace(/\D/g, '');

      if (digitsOnly.length < 11) {
        toast.error('전화번호는 최소 11자리 숫자여야 합니다.');
        return
      }
    }

    const updates: Partial<typeof userData> = {};

    if (formState.name !== userData.name) updates.name = formState.name;
    if (formState.email !== userData.email) updates.email = formState.email;
    if (formState.phoneNumber !== userData.phoneNumber) updates.phoneNumber = formState.phoneNumber.replace(/\D/g, '');

    const schoolUpdates: Partial<typeof userData.school> = {};
    if (formState.schoolName !== userData.school?.name) schoolUpdates.name = formState.schoolName;
    if (formState.schoolMajor !== userData.school?.major) schoolUpdates.major = formState.schoolMajor;
    if (formState.graduationStatus !== userData.school?.graduation_status) schoolUpdates.graduation_status = formState.graduationStatus;

    if (Object.keys(schoolUpdates).length > 0) {
      updates.school = {
        ...userData.school,
        ...schoolUpdates,
      };
    }

    if (Object.keys(updates).length === 0) {
      setEditing(false);
      return;
    }

    updates.updatedAt = serverTimestamp();

    const docRef = doc(db, "users", authUser.uid);
    await updateDoc(docRef, updates);

    setEditing(false);
    await refetchUserData();
  };

  const handleCopy = () => {
    if (!userData?.referralCode) return;

    navigator.clipboard.writeText(userData.referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // reset copy state after 1.5s
      })
      .catch(() => {
        // optionally handle copy error
      });
  };


  if (!userData) return <div className="p-6">유저가 없습니다.</div>;

  return (
    <AuthCheck >
      <div className="relative max-w-xl mx-auto p-6 mt-8 sm:mt-4 min-h-[60vh] pb-24">
        <h1 className="text-3xl text-gray-900 font-bold mb-4 sm:mb-8">마이 페이지</h1>
        {!editing && 
          <>
            <div className="absolute top-6 right-6">
              <button onClick={() => setEditing(true)} className="bg-gray-500 text-white px-4 py-1 rounded ml-auto text-sm">수정하기</button>
            </div>
            <div className="absolute bottom-4 right-6 left-6 ">
              <button onClick={handleCopy} className="w-full text-center bg-dark text-white px-8 py-2 rounded hover:bg-blue-900 flex gap-8 justify-center">
                <div><strong>추천인 코드:</strong> {userData.referralCode}</div>
                <div className="flex items-center">
                  {copied ? (
                    <Check className="w-5 h-5" color="#ffffff" />
                  ) : (
                    <Copy className="w-5 h-5" color="#ffffff" />
                  )}
                </div>
              </button>
            </div>
          </>
        }

        {editing ? (
          <div className="space-y-4">
            <TextField label="성명" name="name" value={formState.name} onChange={handleChange} />
            <TextField label="이메일" name="email" value={formState.email} onChange={handleChange} disabled={true}/>
            <TextField label="전화번호" name="phoneNumber" value={formState.phoneNumber} onChange={handleChange} />
            <TextField label="학교" name="schoolName" value={formState.schoolName} onChange={handleChange} />
            <TextField label="전공" name="schoolMajor" value={formState.schoolMajor} onChange={handleChange} />
            <div className="grid grid-cols-[8ch_1fr] justify-center items-center">
              <label className="text-sm font-medium block mb-1">졸업 여부</label>
              <select
                value={formState.graduationStatus}
                onChange={(e) => setFormState({ ...formState, graduationStatus: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="">선택</option>
                <option value="재학중">재학중</option>
                <option value="졸업예정">졸업예정</option>
                <option value="졸업">졸업</option>
              </select>
            </div>
            <div className="flex">
              <button onClick={handleSave} className="ml-auto bg-gray-600 text-white px-4 py-2 rounded">저장 하기</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-bold"><strong></strong> {userData.name}님, 안녕하세요.</p>
            <p className="bg-primary/40 py-2 px-6 rounded"><strong>이메일:</strong> {userData.email}</p>
            <p className="bg-primary/40 py-2 px-6 rounded"><strong>전화번호:</strong> {userData.phoneNumber}</p>
            <p className="bg-primary/40 py-2 px-6 rounded"><strong>학교:</strong> {userData.school?.name}</p>
            <p className="bg-primary/40 py-2 px-6 rounded"><strong>전공:</strong> {userData.school?.major}</p>
            <p className="bg-primary/40 py-2 px-6 rounded"><strong>졸업 여부:</strong> {userData.school?.graduation_status ? "졸업" : "재학 중"}</p>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}

function TextField({ label, name, value, disabled = false, onChange }: {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid grid-cols-[8ch_1fr] justify-center items-center">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {disabled ? (
        <p className="w-full border rounded p-2 bg-gray-100 text-gray-500">{value}</p>
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded p-2"
        />
      )}
    </div>
  );
}
