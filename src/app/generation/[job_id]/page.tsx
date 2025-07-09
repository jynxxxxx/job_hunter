'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import { getQuestionTemplate } from '@/components/HelperFunctions';
import DynamicQuestionSection from '@/components/DynamicQuestionSection';
import genStyles from "@/styles/generation.module.scss";
import GuideResult from '@/components/layoutSections/GuideResults';
import { EssayOutputProps, GuideOutputProps } from '@/types/forms';
import { DotSpinner } from '@/components/layoutSections/DotSpinner';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function GenerationDynamicPage({ params }: { params: Promise<{ job_id: string }> }) {
  const { authUser } = useAuth()
  const { jobList, jobTemplates, userData, setUserData, setActivePage } = useUserData();
  const { job_id: encodedJobId } = React.use(params);
  const router = useRouter();
  const jobURI = decodeURIComponent(encodedJobId);
  const job_id = jobURI.split('xY_')[0];
  const template = getQuestionTemplate(job_id, jobTemplates);
  const sectionKeys = template
    ? Object.keys(template)
      .filter(k => k.startsWith("q") && !k.includes("question"))
      .sort((a, b) => {
        const keyA = a.startsWith('q') ? a.slice(1) : a;
        const keyB = b.startsWith('q') ? b.slice(1) : b;

        const isNumberA = /^\d+$/.test(keyA);
        const isNumberB = /^\d+$/.test(keyB);
        const isAlphaA = /^[a-zA-Z가-힣\s]+$/.test(keyA);
        const isAlphaB = /^[a-zA-Z가-힣\s]+$/.test(keyB);

        // Case 1: both alpha
        if (isAlphaA && isAlphaB) {
          return keyA.localeCompare(keyB, 'ko');
        }

        // Case 2: both numbers
        if (isNumberA && isNumberB) {
          return parseInt(keyA) - parseInt(keyB);
        }

        // Case 3: mixed alpha and number
        if (isAlphaA && isNumberB) return -1; // alpha first
        if (isNumberA && isAlphaB) return 1;  // alpha first

        // Case 4: one or both symbols
        if (isAlphaA) return -1;  // alpha before symbol
        if (isAlphaB) return 1;

        if (isNumberA) return -1; // number before symbol
        if (isNumberB) return 1;

        // Both symbols or unclassified, compare lex
        return keyA.localeCompare(keyB, 'ko');
      })
    : [];
  const [activeTab, setActiveTab] = useState(sectionKeys[0] || '');
  const [guide, setGuide] = useState<GuideOutputProps | null>(null);
  const [essay, setEssay] = useState<EssayOutputProps | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [preview, setPreview] = useState<'guide'|'essay'>('guide');
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const job = jobList.find(job => job.job_id == job_id) || '해당 회사';
  const [userHasPaid, setUserHasPaid] = useState(false);
  const tokens = userData?.tokens || 0;
  const [submitted, setSubmitted] = useState(false);
  const [openPaywall, setOpenPaywall] = useState(false);

  useEffect(() => {
    if (!activeTab && sectionKeys.length > 0) {
      setActiveTab(sectionKeys[0]);
    }
  }, [sectionKeys, activeTab]);

  useEffect(() => {
    const paidCheck = userData?.hasPaid?.[job_id] === true;
    setUserHasPaid(paidCheck)
  }, []);

  useEffect(() => {
    if (waiting && !running) {
      stageSetRef.current = [
        { text: '고객님의 정보를 안전하게 접수했습니다.', duration: 2000 + Math.random() * 1000 },
        { text: '입력하신 내용을 분석 중입니다.', duration: 10000 + Math.random() * 5000 },
        { text: `${job.company} 합격 자기소개서 데이터를 참고하고 있습니다.`, duration: 10000 + Math.random() * 5000 },
        { text: '고객님 맞춤형 자기소개서 가이드를 작성하고 있습니다.', duration: 13000 + Math.random() * 5000 },
        { text: '최종 결과물을 준비 중입니다. 곧 확인하실 수 있습니다.', duration: 15000 + Math.random() * 5000 }
      ];
      setRunning(true);
      setStageIndex(0);
    }
  }, [waiting, running, job.company]);

  useEffect(() => {
    if (!running || !stageSetRef.current) return;
    const stages = stageSetRef.current;
    if (stageIndex >= stages.length - 1) {
      setPreview('guide');
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      setStageIndex(stageIndex + 1);
    }, stages[stageIndex].duration);
    return () => clearTimeout(timer);
  }, [running, stageIndex]);

  const handleUseToken = async () => {
    if (!userData || !authUser ) return;
    setSubmitted(true);
    if (userData.tokens && userData.tokens > 0) {
      try {
        const userRef = doc(db, 'users', authUser.uid);
        // Atomically update tokens and add job ID to paidJobs
        await updateDoc(userRef, {
          tokens: increment(-1), // Decrement tokens by 1
          [`hasPaid.${job_id}`]: true, // Mark this job_id as paid with a timestamp
        });

        setUserHasPaid(true) // Unlock content
        
        toast.success('토큰이 사용되어 해당 공고를 열람할 수 있습니다!');
        setUserData((prev: any) => {
          if (!prev) return prev; // null check

          return {
            ...prev,
            tokens: (prev.tokens || 0) - 1,
          };
        });
      } catch (error) {
        console.error('Error using token:', error);
        toast.error('토큰 사용 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setSubmitted(false);
      }
    } else {
      // This case should ideally not be reached if button is disabled/hidden
      toast.error('토큰이 부족합니다. 토큰 구매 페이지로 이동합니다.');
      setSubmitted(false);
      router.push('/tokens'); // Redirect to buy tokens page
      setActivePage("tokens");
    }
  };

  if (!template) {
    return <div className="p-8 text-center text-xl">해당 회사/직무에 대한 질문 템플릿이 없습니다.</div>;
  }

  return (
    <AuthCheck>
      <div className='relative min-h-screen'>
        <div className={genStyles.grid} >
          <button
            onClick={() => {
              router.push('/dashboard');
              setActivePage("generation");
            }}
            className="text-sm text-gray-700 hover:text-black  px-4 py-2 rounded-md mb-4"
          >
            ← 돌아가기
          </button>
          <div className={genStyles.leftSide} >
            <h1 className='font-extrabold text-xl pb-4 text-dark text-[1.6rem]'>
              {job.company} {job.title}<br />
              {job.position}<br />
              <br />
              AI 자기소개서 생성
            </h1>
            <div className="text-lg font-bold text-gray-700">
              문항 별로 작성 후 하단 &apos;나만의 자기소개서/가이드 작성하기&apos; 클릭 부탁드립니다.
            </div>
            <div className="flex gap-[0.5rem] items-center justify-start text-gray-500 pb-[0.5rem] ">
              <div className="text-xl">※</div>
              <div className="text-center">개인의 경험을 최대한 자세하게 작성해 주세요.</div>
            </div>
            <div className='flex gap-12 my-6 border-b border-gray-300'>
              {sectionKeys.map((section) => (
                <div
                  key={section}
                  className={`${genStyles.tab} ${activeTab === section ? genStyles.active : ''}`}
                  onClick={() => {
                    setGuide(null);
                    setActiveTab(section);
                    setEssay(null);
                  }}
                >
                  {(() => {
                    const key = section.startsWith('q') ? section.slice(1) : section;
                    return /^\d+$/.test(key) ? `${key}번 문항` : `${key} 문항`;
                  })()}
                </div>
              ))}
            </div>
            {/* Show the question text for the active tab */}
            {activeTab && (
              <div className="mb-4 text-lg font-semibold">
                {(template as any)[`question${activeTab.slice(1)}`]}
              </div>
            )}
            {activeTab && (
              <DynamicQuestionSection
                key={activeTab}
                job_id={job_id}
                section={activeTab}
                question_id={activeTab.slice(1)}
                setGuide={setGuide}
                setEssay={setEssay}
                waiting={waiting}
                setWaiting={setWaiting}
                setRunning={setRunning}
                running={running}
                setOpenPaywall={setOpenPaywall}
                userHasPaid = {userHasPaid}
              />
            )}
          </div>
          <div className={genStyles.rightSide} id="top">
              <div >
                <div className={`${genStyles.question} text-center`}>
                  바로지원 AI가 생성한 가이드/자기소개서
                </div>            
                <div className='flex w-full mx-auto bg-gray-300 p-[0.2rem] rounded-t-[0.5rem] border border-gray-500'>
                  <div 
                    className={`${genStyles.resultTab} ${running || !guide && genStyles.tabDisabled} ${!running && guide && preview === 'guide' ? genStyles.active : ''}`}
                    onClick={() => { if (guide) setPreview("guide"); }}
                  >
                    가이드
                  </div>
                  {!guide && <div className="my-auto w-[2px] h-full bg-gray-500 overflow-hidden">.</div>}
                  <div 
                    className={`${genStyles.resultTab} ${running || !guide && genStyles.tabDisabled} ${!running && guide && preview === 'essay' ? genStyles.active : ''}`}
                    onClick={() => { if (guide) setPreview("essay"); }}
                  >
                    자기소개서
                  </div>
                </div>
                {running ? (
                  <div className={genStyles.guideCtn}>
                    <div className='w-full pt-[2rem] text-center'>{stageSetRef.current?.[stageIndex].text}</div>
                    <div className='w-full pt-8'><DotSpinner /></div>
                  </div>
                ) : (
                  guide ? 
                    <>
                      {preview === "guide" ? (
                        <div className={genStyles.guideCtn}><GuideResult {...guide} /></div>
                      ) : (
                        <div className={genStyles.guideCtn}>
                          {essay && (
                            <>
                              <div className="text-lg whitespace-pre-line">
                                {essay.essay}
                              </div>
                              <div className='w-[fit-content] mt-4 ml-auto text-gray-400'>{essay?.length}자</div>
                            </>
                          )}
                        </div>
                      )}
                    
                    </>
                    : <textarea
                        value=""
                        placeholder="여기에 AI가 작성한 가이드가 표시됩니다."
                        disabled
                        className={genStyles.guideCtn}
                      />
                )}
              </div>
          </div>
        </div>
        {!userHasPaid && openPaywall && (
          <>
            <div className={genStyles.paywallOverlay}></div>
            <div className={genStyles.paywallMessage}>
              <h2>🔒 프리미엄 콘텐츠입니다</h2>
              <div className='w-full bg-[#F9F9FB] rounded-xl py-4 px-4 '>
                <div className='font-extrabold text-center pb-4 text-lg sm:text-xl'>인사 전문가와 AI가 만드는 맞춤형 자기소개서</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <div>
                      채용 공고를 분석해 직무별 요구사항을 반영한 알고리즘으로,<br />
                      지원자의 실제 강점과 경험을 살려내는 자소서를 제공합니다<br />
                      <div className='mt-3 text-lg font-bold text-gray-800'>
                        공고별 1 토큰 사용
                      </div>
                    </div>
                    <div className="mb-6 text-center">
                      <p className="text-md sm:text-lg text-gray-800 font-semibold mb-2">
                        현재 보유 토큰: <span className="text-bright text-xl font-extrabold">{userData?.tokens || 0}개</span>
                      </p>
                    </div>

                    {(tokens > 0) ? (
                      <button
                        onClick={handleUseToken}
                        className="w-full bg-bright text-white py-3 rounded-lg font-semibold text-lg
                                  hover:brightness-90 transition-colors"
                        disabled={submitted}
                      >
                        토큰 사용하기 ({userData?.tokens || 0}개 중 1개)
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          router.push('/tokens')
                          setActivePage("tokens");
                        }}
                        className="w-full bg-dark text-white py-3 rounded-lg font-semibold text-lg
                                  hover:bg-brightness-110 transition-colors"
                      >
                        토큰 구매하러 가기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthCheck>
  );
}

