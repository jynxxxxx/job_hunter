'use client'

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { convertFirebaseTimestamp } from '../HelperFunctions';
import GuideResult from '../layoutSections/GuideResults';
import { GuideOutputProps } from '@/types/forms';
import genStyles from "@/styles/generation.module.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestionTemplate } from '@/templates/jobQuestions';
import { useUserData } from '@/context/UserDataContext';

type Generation = {
  createdAt?: { seconds: number; nanoseconds: number };
  input: any;
  guide: GuideOutputProps['guideline'];
  essay: string;
  job_id?: string;
  question_id?: string;
  id?: string;
};

export default function HistoryPage() {
  const { authUser, setLoading } = useAuth();
  const { jobList } = useUserData();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const [preview, setPreview] = useState<"guide" | "essay">("guide");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const fetchGenerations = async () => {
      const q = query(
        collection(db, 'users', authUser.uid, 'generations'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Generation[];

      setGenerations(data);
      setLoading(false);
    };

    fetchGenerations();
  }, [authUser]);

  if (!authUser) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="pt-[2rem] min-h-[85vh]">
      <h1 className="text-3xl font-bold mb-4 px-12 pb-6 pt-4">생성한 자기소개서 기록</h1>
      {generations.length === 0 ? (
        <div>기록이 없습니다.</div>
      ) : (
        <div className="flex h-fit relative">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="z-30 absolute top-[-0.5rem] left-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Sidebar */}
          <div
            className={`
              h-[85vh] transition-width duration-300 ease-in-out
              ${collapsed ? 'w-0' : 'max-w-[30vw]'}
              sm:max-w-[300px] min-w-fit flex-shrink-0
            `}
          >
            {!collapsed && (
              <div className="overflow-y-scroll h-full pr-2 bg-primary/80 border-r py-8 pl-6 sm:max-w-[30vw]">
                {generations.map((gen, index) => {
                  const date = convertFirebaseTimestamp(gen, 'createdAt');
                  const isSelected = selectedGen === gen;
                  // Find job info from jobList
                  const jobInfo = jobList.find(j => String(j.job_id) === String(gen.job_id));
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedGen(gen)}
                      className="py-2 border-b"
                    >
                      <div className={`ml-2 px-4 py-2 hover:bg-dark/25 cursor-pointer rounded ${isSelected ? 'bg-[#FEF3C6] font-bold mr-[-0.5rem]' : ''}`}>
                        <div className="font-semibold text-lg">
                          {jobInfo ? `${jobInfo.company} - ${jobInfo.title}` : (gen.job_id ? `Job ${gen.job_id}` : '회사 미지정')}
                          <br /> {gen.question_id ? `${gen.question_id}번 문항` : '질문 없음'}
                        </div>
                        <div className="text-sm text-gray-500">{date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Content area */}
          <div className={`flex flex-col items-center justify-center flex-grow mb-12 transition-all duration-300 ease-in-out ${collapsed ? 'w-[100vw]' : 'w-[60vw]'}`}>
            <div className={`mt-6 flex bg-gray-300 p-[0.2rem] rounded-t-lg border border-gray-500 ${collapsed ? 'ml-0 w-[90%]' : 'ml-6 w-[60vw]'}`}>
              <div
                className={`${genStyles.resultTab} ${preview === 'guide' ? genStyles.active : ''}`}
                onClick={() => setPreview("guide")}
              >
                가이드
              </div>
              <div
                className={`${genStyles.resultTab} ${preview === 'essay' ? genStyles.active : ''}`}
                onClick={() => setPreview("essay")}
              >
                자기소개서
              </div>
            </div>
            <div className={`bg-[#d1d5dc46] border border-gray-700 min-h-[60vh] ${collapsed ? 'ml-0 w-[90%]' : 'ml-6 w-[60vw]'} rounded-b-lg`}>
              {selectedGen ? (
                <div className="bg-white/70 py-8 px-4 sm:px-16 h-[60vh] rounded-b-lg flex flex-col gap-8 overflow-y-scroll">
                  <div className="text-gray-700 text-[1.3rem]">
                    {(() => {
                      const jobInfo = jobList.find(j => String(j.job_id) === String(selectedGen.job_id));
                      return (
                        <>
                          <strong>지원 회사:</strong> {jobInfo ? `${jobInfo.company} - ${jobInfo.title}` : 'N/A'}
                        </>
                      );
                    })()}
                  </div>
                  <div className="text-gray-700 text-[1.3rem]">
                    {(() => {
                      const template = getQuestionTemplate(selectedGen.job_id || '');
                      const qid = selectedGen.question_id || selectedGen.input?.question_id;
                      const questionText = qid ? (template as any)?.[`question${qid}`] : undefined;
                      return (
                        <>
                          <strong>{qid ? `${qid}번 문항:` : ""}</strong> {questionText || "알 수 없는 질문"}
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    {preview === "guide" && (
                      <div className="whitespace-pre-line mt-1">
                        <GuideResult guideline={selectedGen.guide} />
                      </div>
                    )}
                    {preview === "essay" &&
                      (selectedGen.essay ? (
                        <div className="text-bold text-lg whitespace-pre-line mt-1 pb-8">
                          {selectedGen.essay.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center pt-12 text-black text-lg">
                          이 생성 기록에는 저장된 자소서가 없습니다.
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/70 py-8 px-16 min-h-[60vh] rounded-b-lg text-center pt-12 text-black text-lg">
                  왼쪽에서 자소서를 선택해주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
