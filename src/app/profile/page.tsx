"use client"

import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

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
    schoolGraduated: false,
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
      schoolGraduated: userData.school?.graduated || false,
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const digitsOnly = e.target.value.replace(/\D/g, '');

    setFormState((prev) => ({ ...prev, phoneNumber: digitsOnly }));

    // Validation
    if (digitsOnly.length < 10) {
      toast.error('전화번호는 최소 10자리 숫자여야 합니다.');
    } else {
      toast.error('');
    }
  };

  const handleSave = async () => {
    if (!userData || !authUser) return;

    const updates: Partial<typeof userData> = {};

    if (formState.name !== userData.name) updates.name = formState.name;
    if (formState.email !== userData.email) updates.email = formState.email;
    if (formState.phoneNumber !== userData.phoneNumber) updates.phoneNumber = formState.phoneNumber;

    const schoolUpdates: Partial<typeof userData.school> = {};
    if (formState.schoolName !== userData.school?.name) schoolUpdates.name = formState.schoolName;
    if (formState.schoolMajor !== userData.school?.major) schoolUpdates.major = formState.schoolMajor;
    if (formState.schoolGraduated !== userData.school?.graduated) schoolUpdates.graduated = formState.schoolGraduated;

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
    <div className="relative max-w-xl mx-auto p-6 mt-8 sm:mt-4 min-h-[60vh] pb-24">
      <h1 className="text-2xl font-bold mb-4 sm:mb-8">마이 페이지</h1>
      {!editing && 
        <>
          <div className="absolute top-6 right-6">
            <button onClick={() => setEditing(true)} className="bg-gray-800 text-white px-4 py-1 rounded ml-auto text-sm">수정하기</button>
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
          <TextField label="전화번호" name="phoneNumber" value={formState.phoneNumber} onChange={handlePhoneChange} />
          <TextField label="학교" name="schoolName" value={formState.schoolName} onChange={handleChange} />
          <TextField label="전공" name="schoolMajor" value={formState.schoolMajor} onChange={handleChange} />
          <div>
            <label className="text-sm font-medium block mb-1">졸업 여부</label>
            <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="schoolGraduated"
              value="true"
              checked={formState.schoolGraduated === true}
              onChange={() => setFormState(prev => ({ ...prev, schoolGraduated: true }))}
              className="mr-2"
            />
            <span>졸업</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="schoolGraduated"
              value="false"
              checked={formState.schoolGraduated === false}
              onChange={() => setFormState(prev => ({ ...prev, schoolGraduated: false }))}
              className="mr-2"
            />
            <span>재학중</span>
          </label>
          </div>
          <div className="flex">
            <button onClick={handleSave} className="ml-auto bg-gray-600 text-white px-4 py-2 rounded">저장 하기</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-lg font-bold"><strong></strong> {userData.name}님, 안녕하세요.</p>
          <p className="bg-primary py-2 px-6 rounded"><strong>이메일:</strong> {userData.email}</p>
          <p className="bg-primary py-2 px-6 rounded"><strong>전화번호:</strong> {userData.phoneNumber}</p>
          <p className="bg-primary py-2 px-6 rounded"><strong>학교:</strong> {userData.school?.name}</p>
          <p className="bg-primary py-2 px-6 rounded"><strong>전공:</strong> {userData.school?.major}</p>
          <p className="bg-primary py-2 px-6 rounded"><strong>졸업 여부:</strong> {userData.school?.graduated ? "졸업" : "재학 중"}</p>
        </div>
      )}
    </div>
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
    <div className="grid grid-cols-[7ch_1fr] justify-center items-center">
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
