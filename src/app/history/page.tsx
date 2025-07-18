'use client'

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { convertFirebaseTimestamp } from '@/components/HelperFunctions';
import GuideResult from '@/components/layoutSections/GuideResults';
import { GuideOutputProps } from '@/types/forms';
import genStyles from "@/styles/generation.module.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestionTemplate } from '@/components/HelperFunctions';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';

type Generation = {
  createdAt?: { seconds: number; nanoseconds: number };
  input?: any;
  guide: GuideOutputProps['guideline'];
  essay?: string;
  job_id?: string;
  question_id?: string;
  id?: string;
  type: string;
  company_name?: string;
  job_title?: string;
  question_text?: string;
  revision?: string;
  feedback?: string[]
};

export default function HistoryPage() {
  const { authUser, setLoading } = useAuth();
  const { jobList, jobTemplates } = useUserData();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const [preview, setPreview] = useState<"guide" | "essay" | "answers" | "feedback" >("essay");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    const fetchAllGenerations = async () => {
      setLoading(true);
      
      const userId = authUser.uid;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const generationsRef = collection(db, 'users', userId, 'generations');
        const revisionsRef = collection(db, 'users', userId, 'revisions');

        const [genSnap, revSnap] = await Promise.all([
          getDocs(query(generationsRef, orderBy('createdAt', 'desc'))),
          getDocs(query(revisionsRef, orderBy('createdAt', 'desc'))),
        ]);

        const gens = genSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.job_id === 'open' ? 'open' : 'job',
            ...data,
          } as Generation;
        });

        const revs = revSnap.docs.map(doc => ({
          id: doc.id,
          type: 'revision',
          ...doc.data(),
        } as Generation));

        const merged = [...gens, ...revs].sort((a, b) => {
          const convertToMillis = (
            timestampObj: { seconds?: number; nanoseconds?: number } | undefined | null
          ): number => {
            if (timestampObj && typeof timestampObj.seconds === 'number') {
              return timestampObj.seconds * 1000 + Math.floor((timestampObj.nanoseconds || 0) / 1_000_000);
            }
            return 0;
          };

          const timeA = convertToMillis(a.createdAt);
          const timeB = convertToMillis(b.createdAt);

          return timeB - timeA;
        });

        setGenerations(merged);
      } catch (err) {
        console.error('Error fetching generations or revisions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGenerations();
  }, [authUser]);

  if (!authUser) return <div>로그인이 필요합니다.</div>;

  return (
    <AuthCheck>
      <div className="pt-[4rem] min-h-[85vh]">
        <h1 className="text-2xl font-bold mb-4 px-12 pb-6 pt-4">생성한 자기소개서 기록</h1>
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
                ${collapsed ? 'w-0' : 'w-[100vw]'}
                sm:max-w-[300px] min-w-fit flex-shrink-0
              `}
            >
              {!collapsed && (
                <div className="overflow-y-scroll h-full pr-2 bg-primary/80 border-r py-8 pl-6 sm:min-w-[25vw] sm:max-w-[30vw]">
                  {generations.length === 0 ? (
                    <div className='text-center pt-4'>기록이 없습니다.</div>
                  ) : (
                    generations.map((gen, index) => {
                      const isSelected = selectedGen === gen;
                      if (gen.type == 'job') {
                        const date = convertFirebaseTimestamp(gen, 'createdAt');
                        // Find job info from jobList
                        const jobInfo = jobList.find(j => String(j.job_id) === String(gen.job_id));
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setPreview("essay")
                              setSelectedGen(gen)
                            }}
                            className="py-2 border-b"
                          >
                            <div className={`ml-2 px-4 py-2 hover:bg-dark/25 cursor-pointer rounded ${isSelected ? 'bg-[#FEF3C6] font-bold mr-[-0.5rem]' : ''}`}>
                              <div className="font-semibold text-md text-gray-900">
                                {jobInfo ? `${jobInfo.company} - ${jobInfo.title}` : (gen.job_id ? `Job ${gen.job_id}` : '회사 미지정')}
                                <br /><span className='text-sm text-gray-700'>{gen.question_id ? `${gen.question_id}번 문항` : '질문 없음'}</span>
                              </div>
                              <div className="text-xs text-gray-500">{date}</div>
                            </div>
                          </div>
                        );
                      }
                      if (gen.type == 'open') {
                        const date = convertFirebaseTimestamp(gen, 'createdAt');
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setPreview("essay")
                              setSelectedGen(gen)
                            }}
                            className="py-2 border-b"
                          >
                            <div className={`ml-2 px-4 py-2 hover:bg-dark/25 cursor-pointer rounded ${isSelected ? 'bg-[#FEF3C6] font-bold mr-[-0.5rem]' : ''}`}>
                              <div className="font-semibold text-md text-gray-900">
                                {gen.company_name} - {gen.job_title}
                                <br /><span className='text-sm text-gray-700'>문항: {gen.question_text}</span>
                              </div>
                              <div className="text-xs text-gray-500">{date}</div>
                            </div>
                          </div>
                        );
                      }
                      if (gen.type == 'revision') {
                        const date = convertFirebaseTimestamp(gen, 'createdAt');
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setPreview("essay")
                              setSelectedGen(gen)
                            }}
                            className="py-2 border-b"
                          >
                            <div className={`ml-2 px-4 py-2 hover:bg-dark/25 cursor-pointer rounded ${isSelected ? 'bg-[#FEF3C6] font-bold mr-[-0.5rem]' : ''}`}>
                              <div className="font-semibold text-md text-gray-900">
                                {gen.company_name} - {gen.job_title}
                                <br /><span className='text-sm text-gray-700'>문항: {gen.question_text}</span>
                              </div>
                              <div className="text-xs text-gray-500">{date}</div>
                            </div>
                          </div>
                        );
                      }
                    })
                  )}
                </div>
              )}
            </div>

            {/* Content area */}
            <div className={`flex flex-col items-center justify-start flex-grow mb-12 transition-all duration-300 ease-in-out ${collapsed ? 'w-[100vw]' : 'w-[60vw]'}`}>
              <div className={`flex bg-gray-300 p-[0.2rem] rounded-t-lg border border-gray-500 ${collapsed ? 'ml-0 w-[90%]' : 'ml-6 w-[60vw]'}`}>
                <div
                  className={`${genStyles.resultTab} ${preview === 'essay' ? genStyles.active : ''}`}
                  onClick={() => setPreview("essay")}
                >
                  자기소개서
                </div>
                { (selectedGen == null || selectedGen.type == "job" ) && (
                <div
                  className={`${genStyles.resultTab} ${preview === 'guide' ? genStyles.active : ''}`}
                  onClick={() => setPreview("guide")}
                >
                  가이드
                </div>
                )}
                { selectedGen?.type == "open" && (
                <div
                  className={`${genStyles.resultTab} ${preview === 'answers' ? genStyles.active : ''}`}
                  onClick={() => setPreview("answers")}
                >
                  질문 답변
                </div>
                )}
                { selectedGen?.type == "revision" && (
                <div
                  className={`${genStyles.resultTab} ${preview === 'feedback' ? genStyles.active : ''}`}
                  onClick={() => setPreview("feedback")}
                >
                  피드백
                </div>
                )}
              </div>
              <div className={`bg-[#d1d5dc46] border border-gray-700 min-h-[60vh] ${collapsed ? 'ml-0 w-[90%]' : 'ml-6 w-[60vw]'} rounded-b-lg`}>
                {selectedGen ? (
                  <div className="bg-white/70 py-8 px-4 sm:px-16 h-[60vh] rounded-b-lg flex flex-col gap-8 overflow-y-scroll">
                    <div className="text-gray-700 text-lg">
                      {selectedGen.type === "job" && (() => {
                        const jobInfo = jobList.find(j => String(j.job_id) === String(selectedGen.job_id));
                        return (
                          <>
                            <strong>지원 회사:</strong> {jobInfo ? `${jobInfo.company} - ${jobInfo.title}` : 'N/A'}
                          </>
                        );
                      })()}
                      { (selectedGen.type === "revision" || selectedGen.type === "open") && (
                        <div>
                          <strong>지원 회사:</strong> {selectedGen.company_name}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-700 text-lg">
                      {selectedGen.type === "job" && (() => {
                        const template = getQuestionTemplate(selectedGen.job_id || '', jobTemplates);
                        const qid = selectedGen.question_id || selectedGen.input?.question_id;
                        const questionText = qid ? (template as any)?.[`question${qid}`] : undefined;
                        return (
                          <>
                            <strong>{qid ? `${qid}번 문항:` : ""}</strong> {questionText || "알 수 없는 질문"}
                          </>
                        );
                      })()}
                      { (selectedGen.type === "revision" || selectedGen.type === "open") && (
                        <div>
                          <strong>문항:</strong> {selectedGen.question_text}
                        </div>
                      )}
                    </div>
                    <div>
                      {preview === "answers" && (
                        <div className="whitespace-pre-line mt-1">
                          <div className="space-y-6 border border-gray-200 rounded-xl p-8">
                            {selectedGen.input.subquestions.map((question: any, index: any) => (
                              <div key={index} className="pb-4 border-b border-gray-300">
                                <h3 className="font-semibold mb-1">{question}</h3>
                                <div className="whitespace-pre-wrap p-2">
                                  {selectedGen.input.user_input?.[index]
                                    ? selectedGen.input.user_input[index]
                                    : <span className="text-gray-400 italic">답변 없었습니다</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                       {preview === "feedback" && (
                        <div className="whitespace-pre-line mt-1">
                          {selectedGen?.feedback?.map((msg: any, i:any) => (
                          <div key={i} className='mb-4 border border-gray-400 p-4 rounded'>{msg}</div>
                        ))}
                        </div>
                      )}
                      {preview === "guide" && (
                        <div className="whitespace-pre-line mt-1">
                          <GuideResult guideline={selectedGen.guide} />
                        </div>
                      )}
                      {preview === "essay" && (
                        selectedGen.essay ? (
                          <div className="text-bold text-lg whitespace-pre-line mt-1 pb-8">
                            {selectedGen.essay.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </div>
                        ) : selectedGen.revision ? (
                          <div className="text-bold text-lg whitespace-pre-line mt-1 pb-8">
                            {selectedGen.revision.split('\n').map((line, i) => (
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
                        )
                      )}
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
      </div>
    </AuthCheck>
  );
}
