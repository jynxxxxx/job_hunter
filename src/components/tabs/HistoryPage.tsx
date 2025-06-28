'use client'

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // adjust path if needed
import { useAuth } from '@/context/AuthContext';
import { convertFirebaseTimestamp } from '../HelperFunctions';
import HyundaiGuideResult from '../hyundaiSections/HyundaiGuideResults';
import { HyundaiGuideOutputProps } from '@/types/forms';
import hdStyles from "@/styles/hyundai.module.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Generation = {
  createdAt?: { seconds: number; nanoseconds: number };
  input:  any;
  guide: HyundaiGuideOutputProps['result']
  essay:  string;
  company: string;
};

const HyundaiQuestions: Record<string, string> = {
  1: "내가 ‘모빌리티 기술 인력’이라고 생각하는 이유 + 나만의 강점",
  2: "협업 속 문제 해결 경험 + 내 단점과 극복 노력",
  3: "목표 설정 → 어려움 → 극복 과정"
};

export default function HistoryPage() {
  const { authUser, setLoading } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const [preview, setPreview] = useState<"guide"|"essay">("guide")
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);  // Make sure loading is false if no user
      return;
    }
    setLoading(true);
    const fetchGenerations = async () => {
      const q = query(
        collection(db, 'users', authUser.uid, 'generations'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as Generation);

      setGenerations(data);
      setLoading(false)
    };

    fetchGenerations();
  }, [authUser]);

  if (!authUser) return <div>로그인이 필요합니다.</div>;

  return (
    <div className='pt-[5rem] min-h-[85vh] bg-gradient-to-r from-primary to-[#f5f6f9]'>
      <h1 className='text-3xl font-bold mb-4 px-12 pb-6 pt-4'>생성한 자기소개서 기록</h1>
      {generations.length === 0 ? (
        <div>기록이 없습니다.</div>
      ) : (
        <div className="flex h-[fit-content] relative">
           <button
              onClick={() => setCollapsed(!collapsed)}
              className="z-30 absolute top-[-0.5rem] left-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          {/* Sidebar list */}
          <div
            className={`
              h-[85vh] sm:h-[90vh] lg:h-[70vh] transition-width duration-300 ease-in-out
              ${collapsed ? 'w-0' : 'w-[25vw]'}
              sm:max-w-[300px]
              min-w-[fit-content]
              flex-shrink-0
            `}
          >
            {!collapsed && (
              <div className="overflow-y-scroll h-full pr-2 bg-dark/15 border-r py-8 pl-6  min-w-[fit-content]">
                {generations.map((gen, index) => {
                  const date = convertFirebaseTimestamp(gen, 'createdAt');
                  const isSelected = selectedGen === gen
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedGen(gen)}
                      className='py-2 border-b'
                    >
                      <div className={`ml-2 px-4 py-2 hover:bg-dark/25 cursor-pointer rounded ${isSelected ? 'bg-[#FEF3C6] font-bold mr-[-0.5rem]' : '' }`}>
                        <div className="font-semibold text-lg">{gen.company} - {gen.input?.question_id ? `${gen.input?.question_id}번 문항` : '질문 없음'}</div>
                        <div className="text-sm text-gray-500">{date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className={`h-[fit-content] flex mx-auto flex-col mb-12 items-center justify-center flex-grow transition-all duration-300 ease-in-out ${collapsed ? 'w-[100vw]'  : 'w-[70vw]'}`}>
            <div className={`mt-6 flex bg-gray-300 p-[0.2rem] rounded-t-[0.5rem] border border-gray-500 ${collapsed ? 'ml-0 w-[90%]'  : 'ml-6 w-[70vw]'}`}>
              <div 
                className={`${hdStyles.tab} ${preview === 'guide' ? hdStyles.active : ''}`}
                onClick={() => {setPreview("guide")}}
              >
                가이드
              </div>
              <div 
                className={`${hdStyles.tab} ${preview === 'essay' ? hdStyles.active : ''}`}
                onClick={() => {setPreview("essay")}}
              >
                자기소개서
              </div>
            </div>
            <div className={`min-h-[60vh] ${collapsed ? 'ml-0 w-[90%]' : 'ml-6 w-[70vw]'}`}>
              {selectedGen ? (
                <div className='bg-white/70 py-8 px-4 sm:px-16 h-[60vh] rounded-b-[0.5rem] flex flex-col gap-8 overflow-y-scroll '>
                  <div className="text-gray-700 text-[1.3rem]">
                    <strong>지원 회사:</strong> {selectedGen.company}
                  </div>
                  <div className="text-gray-700 text-[1.3rem]">
                    <strong>{selectedGen.input?.question_id ? `${selectedGen.input?.question_id}번 문항:` : ""}</strong> {HyundaiQuestions[selectedGen.input?.question_id] || "알 수 없는 질문"}
                  </div>
                  <div className="">
                    {preview === "guide" && (
                      <div className="whitespace-pre-line mt-1">
                        <HyundaiGuideResult result={selectedGen.guide} />
                      </div>
                    )}
                    {preview === "essay" && (
                      selectedGen.essay ? 
                        (
                          <div className="text-bold text-lg whitespace-pre-line mt-1 pb-8">
                            {selectedGen.essay.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <div className='text-center pt-12 text-black text-lg'>
                            이 생성 기록에는 저장된 자소서가 없습니다.
                          </div>
                        )
                      )}
                  </div>
                </div>
              ) : (
                <div className={`bg-white/70 py-8 px-16 min-h-[60vh] rounded-b-[0.5rem] text-center pt-12 text-black text-lg`}>왼쪽에서 자소서를 선택해주세요.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
