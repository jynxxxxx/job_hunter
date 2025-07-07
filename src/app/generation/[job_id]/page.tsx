'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import { getQuestionTemplate } from '@/templates/jobQuestions';
import DynamicQuestionSection from '@/components/DynamicQuestionSection';
import genStyles from "@/styles/generation.module.scss";
import GuideResult from '@/components/layoutSections/GuideResults';
import { EssayOutputProps, GuideOutputProps } from '@/types/forms';
import { DotSpinner } from '@/components/layoutSections/DotSpinner';

export default function GenerationDynamicPage({ params }: { params: Promise<{ job_id: string }> }) {
  const { jobList, userData, setActivePage } = useUserData();
  const { job_id: encodedJobId } = React.use(params);
  const router = useRouter();
  const jobURI = decodeURIComponent(encodedJobId);
  const job_id = jobURI.split('xY_')[0];
  const template = getQuestionTemplate(job_id);
  const sectionKeys = template ? Object.keys(template).filter((k) => /^q\d+$/.test(k)) : [];
  const [activeTab, setActiveTab] = useState(sectionKeys[0] || '');
  const [guide, setGuide] = useState<GuideOutputProps | null>(null);
  const [essay, setEssay] = useState<EssayOutputProps | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [preview, setPreview] = useState<'guide'|'essay'>('guide');
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const job = jobList.find(job => job.job_id == job_id) || '해당 회사';
  const hasPaid = userData?.hasPaid?.[job_id] === true;

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
              {job.company} {job.title} AI 자기소개서 생성
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
                  {parseInt(section.replace('q', ''))}번 문항
                </div>
              ))}
            </div>
            {/* Show the question text for the active tab */}
            {activeTab && (
              <div className="mb-4 text-lg font-semibold">
                {(template as any)[`question${activeTab.replace('q', '')}`]}
              </div>
            )}
            {activeTab && (
              <DynamicQuestionSection
                key={activeTab}
                job_id={job_id}
                section={activeTab}
                question_id={parseInt(activeTab.replace('q', ''))}
                setGuide={setGuide}
                setEssay={setEssay}
                waiting={waiting}
                setWaiting={setWaiting}
                setRunning={setRunning}
                running={running}
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
                            // <>
                            //   {preview === 'essay' && !hasPaid ? (
                            //     <div className="relative">
                            //       <div className="line-clamp-5 text-lg overflow-hidden">
                            //         {essay.essay}
                            //         {/* Gradient overlay to fade the last lines */}
                            //         <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-white pointer-events-none z-5" />
                            //       </div>

                            //       {/* Paywall Overlay */}
                            //       <div className="relative mt-[-5rem] w-full flex justify-center z-10 bg-gradient-to-b from-transparent via-white to-white">
                            //         <div className='w-[90%] max-w-[500px] bg-[#F9F9FB] rounded-xl py-4 pl-4 mt-[7rem] mb-4 border border-gray-200 shadow-lg '>
                            //           <div className='font-extrabold text-center pb-4 text-xl'>직접 작성하기 어려우신가요?</div>
                            //           <div className='flex justify-around gap-6'>
                            //             <div className='flex flex-col justify-center gap-4'>
                            //               <div>
                            //                 <strong>전문가 협력 기반, 자기소개서 전용 AI</strong><br />
                            //                 인사팀 출신 전문가와 함께 만든 전용 AI가<br />
                            //                 1번뿐만 아니라, 2/3번 문항까지 완성도 높은 작성을 도와드립니다.<br />
                            //                 <div className='mt-2 text-lg font-bold'>공고별 19,900원 정액제</div>
                            //               </div>
                            //               <div>
                            //                 <strong>이용 방법</strong><br />
                            //                 <div className='flex flex-col'>
                            //                   <div>① 아래 계좌번호로 19,900원 송금 후,</div>
                            //                   <div>② 입금자명과 이메일을 010-8961-1918로 보내주세요.</div>
                            //                   <div>③ 확인 후 30분 이내에 해당 회사의 모든 문항을 열람할 수 있습니다.</div>
                            //                 </div>
                            //               </div>
                            //               <div className='flex items-center justify-center gap-4 mr-4'>
                            //                 <img src="/qr.png" alt="QR Code" className='w-[8rem]' />
                            //                 <div>
                            //                   <p className='text-sm text-center text-black'>카카오뱅크</p>
                            //                   <p className='font-extrabold text-center text-black'>3333058317631</p>
                            //                   <p className='text-center text-black'>박근철</p>
                            //                 </div>
                            //               </div>
                            //             </div>
                            //           </div>
                            //         </div>
                            //       </div>
                            //     </div>
                            //   ) : (
                            //     // Full essay content if paid
                            //     <>
                            //       <div className="text-lg whitespace-pre-line">
                            //         {essay.essay}
                            //       </div>
                            //       <div className='w-[fit-content] mt-4 ml-auto text-gray-400'>{essay?.length}자</div>
                            //     </>
                            //   )}
                            // </>
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
        {!hasPaid && (activeTab !== 'q1') && (
          <>
            <div className={genStyles.paywallOverlay}></div>
            <div className={genStyles.paywallMessage}>
              <h2>🔒 프리미엄 콘텐츠입니다</h2>
              <div className='w-full bg-[#F9F9FB] rounded-xl py-4 px-4 '>
                <div className='font-extrabold text-center pb-4 text-lg sm:text-xl'>2번, 3번 문항은 유료 서비스입니다.</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <div>
                      <strong>전문가 협력 기반, 자기소개서 전용 AI</strong><br />
                      인사팀 출신 전문가와 함께 만든 전용 AI가<br />
                      2번과 3번 문항까지 완성도 높은 작성을 도와드립니다.<br />
                      <div className='mt-2 text-lg font-bold'>
                        공고별 19,900원 정액제
                      </div>
                    </div>
                    <div>
                      <strong>이용 방법</strong><br />
                      <div className='flex flex-col items-start text-start'>
                        <div>① 아래 계좌번호로 19,900원 송금 후,</div>
                        <div>② 입금자명과 이메일을 010-8961-1918로 보내주세요.</div>
                        <div>③ 확인 후 30분 이내에 해당 회사의 모든 문항을 열람할 수 있습니다.</div>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-2 mr-4'>
                      <img src="/qr.png" alt="QR Code" className='w-[13rem]' />
                      <div>
                        <div className='text-sm text-center text-black'>카카오뱅크</div>
                        <div className='font-extrabold text-center text-black'>3333058317631</div>
                        <div className='text-center text-black'>박근철</div>
                      </div>
                    </div>
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

