'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import { getQuestionTemplate } from '@/components/HelperFunctions';
import DynamicQuestionSection from '@/components/DynamicQuestionSection';
import genStyles from "@/styles/generation.module.scss";
import revStyles from "@/styles/revisions.module.scss";
import GuideResult from '@/components/layoutSections/GuideResults';
import { EssayOutputProps, GuideOutputProps } from '@/types/forms';
import { DotSpinner } from '@/components/layoutSections/DotSpinner';
import ProgressIndicator from "@/components/layoutSections/ProgressIndicator";
import { Copy, RefreshCw } from 'lucide-react';
import { QuestionFormRef } from '@/templates/QuestionForm';
import { imageMap } from '@/templates/imageMap';
import Loading from '@/app/loading';
import Image from 'next/image';
import { toast } from 'sonner';

function GenerationDynamicPage({ company, title }: { company: string; title: string }) {
  const { jobList, jobTemplates } = useUserData();
  const questionFormRef = useRef<QuestionFormRef>(null);
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedJob, setSelectedJob] = useState<any>("");
  const jobOptions = jobList.filter(item => item.company === company && item.title === title);
  const [template, setTemplate] = useState<any>("");
  const [templateQuestions, setTemplateQuestions] = useState<{ question: string; key: string }[]>([]);
  const [selectedQuestionKey, setSelectedQuestionKey] = useState("");
  // const [paywall, setPaywall] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const [running, setRunning] = useState(false);
  // const [freePassUsed, setFreePassUsed] = useState(false);
  // const [userHasPaid, setUserHasPaid] = useState(false);
  const [guide, setGuide] = useState<GuideOutputProps | null>(null);
  const [essay, setEssay] = useState<EssayOutputProps | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [preview, setPreview] = useState<'guide'|'essay'>('guide');
  const [lastStep, setLastStep] = useState(false);
  const companyImageSrc = imageMap[company as keyof typeof imageMap];
  
  // useEffect(() => {
  //   const paidCheck = userData?.hasPaid?.[template.job_id] === true || userData?.subscription?.active === true;
  //   setUserHasPaid(paidCheck)
  // }, [template]);
  
  // useEffect(() => {
  //   const fetchGenerationCount = async () => {
  //     if (authUser){
  //       try {
  //         const userRef = doc(db, "users", authUser.uid);
  //         const userSnap = await getDoc(userRef);

  //         const generations = userSnap.exists() ? userSnap.data().generation_count || {} : {};
  //         const generationCount = generations[template.job_id] ?? 0;

  //         const freePassUsed = generationCount > 0;
  //         setFreePassUsed(freePassUsed);
  //       } catch (error) {
  //         console.error('Failed to fetch generation count:', error);
  //       }
  //     }
  //   };

  //   if (userData?.hasPaid?.[template.job_id] === true){
  //     return
  //   }
  //   fetchGenerationCount();
  // }, [authUser, template.job_id, template]);

  useEffect(() => {
    if (waiting && !running) {
      stageSetRef.current = [
        { text: '고객님의 정보를 안전하게 접수했습니다.', duration: 2000 + Math.random() * 1000 },
        { text: '입력하신 내용을 분석 중입니다.', duration: 10000 + Math.random() * 5000 },
        { text: `${selectedJob.company} 합격 자기소개서 데이터를 참고하고 있습니다.`, duration: 10000 + Math.random() * 5000 },
        { text: '고객님 맞춤형 자기소개서 가이드를 작성하고 있습니다.', duration: 13000 + Math.random() * 5000 },
        { text: '최종 결과물을 준비 중입니다. 곧 확인하실 수 있습니다.', duration: 15000 + Math.random() * 5000 }
      ];
      setRunning(true);
      setStageIndex(0);
    }
  }, [waiting, running, selectedJob.company]);

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

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const position = e.target.value
    const job = jobOptions.find(item => item.position === position);
    if (job) {
      setSelectedJob(job); // Save full object
      const selectedTemplate = getQuestionTemplate(String(job.job_id), jobTemplates);
      setTemplate(selectedTemplate)

      const questionKeys = Object.keys(selectedTemplate)
        .filter(k => k.startsWith("question"))
        .sort((a, b) => {
          const keyA = a.replace("question", "");
          const keyB = b.replace("question", "");

          const isNumberA = /^\d+$/.test(keyA);
          const isNumberB = /^\d+$/.test(keyB);
          const isAlphaA = /^[a-zA-Z가-힣\s]+$/.test(keyA);
          const isAlphaB = /^[a-zA-Z가-힣\s]+$/.test(keyB);

          // Korean/alphabetic first
          if (isAlphaA && isAlphaB) {
            return keyA.localeCompare(keyB, 'ko'); // Korean locale sorting
          }

          // Both numbers
          if (isNumberA && isNumberB) {
            return parseInt(keyA) - parseInt(keyB);
          }

          // Mixed alpha and number
          if (isAlphaA && isNumberB) return -1; // alpha first
          if (isNumberA && isAlphaB) return 1;

          // Symbols last
          if (isAlphaA) return -1;  // alpha before symbol
          if (isAlphaB) return 1;

          if (isNumberA) return -1; // number before symbol
          if (isNumberB) return 1;

          // Both symbols or others, lex compare
          return keyA.localeCompare(keyB, 'ko');
        });

      const questions = questionKeys.map(key => ({
        key: key.replace("question",""),
        question: selectedTemplate[key],
      }));
      setTemplateQuestions(questions)
    }
  };

  const handleNextStep = () => {
    if (questionFormRef.current) {
      questionFormRef.current.nextStep(); // example method exposed by QuestionForm
    }
  };

  const handleSubmit = () => {
    if (questionFormRef.current) {
      questionFormRef.current.submitForm(); // example submit method exposed by QuestionForm
    }
    setCurrentStep(currentStep + 1)
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setSelectedJob("");
    setTemplate(null);
    setTemplateQuestions([]);
    setSelectedQuestionKey("");
    // setPaywall(false);
    setStageIndex(0);
    setRunning(false);
    // setFreePassUsed(false);
    // setUserHasPaid(false);
    setGuide(null);
    setEssay(null);
    setWaiting(false);
    setPreview("guide");
    setLastStep(false);

    if (questionFormRef.current) {
      questionFormRef.current?.resetForm();
    }
  };

  const handleCopy = () => {
    if (!essay) {
      toast.error("복사 실패 했습니다!");
      return
    }
    navigator.clipboard.writeText(essay.essay);
    toast.success("복사되었습니다!");
  };

  return (
    <AuthCheck>
      <div className="min-h-[80vh] bg-primary/30">
        <div className={`w-[90vw] md:w-[60vw] mx-auto pb-12 2xl:w-1/2`}>
          <div className='flex flex-col items-center justify-center pt-8'>
            <div className="relative h-[5rem] w-[90%] py-2">
              <Image
                src={companyImageSrc}
                alt={`${company} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div className='text-gray-700'>{title}</div>
          </div>
          <div className="h-fit">
            <div className="container mx-auto px-4 pt-8">
              <div className="max-w-3xl mx-auto">
                <ProgressIndicator currentStep={currentStep} />
              </div>
            </div>
          </div>
          <div className="bg-white px-2 sm:px-8 py-8 rounded-lg border border-gray-300">
            <h2 className="text-3xl font-bold text-center">
              {currentStep==1 && "지원 정보 입력"}
              {currentStep==2 && "세부 질문 답변"}
              {currentStep==3 && "자기소개서 완성"}
            </h2>
            <div className="min-h-[25vh] px-8 pt-8 flex flex-col gap-2">
              {currentStep === 1 && (
                <>
                  <select
                    value={selectedJob.position || ""}
                    onChange={handleJobChange}
                    className="border rounded px-3 py-2 text-md w-full"
                  >
                    <option value="" disabled hidden>직무/공고 선택</option>
                    {jobOptions.map(item => (
                      <option 
                        className="text-md" 
                        key={item.position} 
                        value={item.position}
                      >
                        {item.position}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedQuestionKey || ""}
                    onChange={e => setSelectedQuestionKey(e.target.value)}
                    className="border rounded px-3 py-2 text-md w-full"
                  >
                    <option value="" disabled hidden>문항 선택</option>
                    {templateQuestions.map(({ key, question }) => (
                      <option 
                        className="text-md" 
                        key={key} 
                        value={key}
                      >
                        {(() => {
                          return /^\d+$/.test(key) ? `${key}번 문항: ${question}` : `${key} 문항: ${question}`;
                        })()}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {currentStep === 2 && (
                <DynamicQuestionSection
                  ref={questionFormRef}
                  key={`q${selectedQuestionKey}`}
                  job_id={template.job_id}
                  section={`q${selectedQuestionKey}`}
                  question_id={selectedQuestionKey}
                  setGuide={setGuide}
                  setEssay={setEssay}
                  waiting={waiting}
                  setWaiting={setWaiting}
                  setRunning={setRunning}
                  running={running}
                  // freePassUsed={freePassUsed}
                  setLastStep={setLastStep}
                />
              )}

              {currentStep === 3 && (
                <div className={`relative ${revStyles.sectionctn}`}>
                  {running ? (
                    <>
                    <div className="whitespace-pre-wrap space-y-4 p-8 text-gray-700 text-base leading-relaxed blur-sm select-none pointer-events-none">            
                        <h2 className="text-lg font-bold">
                          추가 질문으로 더 정교하게 보완하기
                          <div className="h-px sm:hidden"><br /></div>
                          (선택 사항)
                        </h2>
                        <div className="space-y-4">
                          {[...Array(7)].map((_, idx) => (
                            <div key={idx}>
                              <div className="h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute z-10 flex flex-col justify-center items-center w-full">
                        <div className='w-full pt-[2rem] text-center drop-shadow-[0_0_4px_white]'>{stageSetRef.current?.[stageIndex].text}</div>
                      <div className='w-full pt-8 pb-16'><DotSpinner /></div>
                    </div>
                    </>
                  ) : (
                    guide?.guideline?.core_keywords ? 
                      <>
                        <div className="mt-6 grid w-full grid-cols-2 mb-6 py-1 px-1 rounded-lg items-center justify-center bg-dark/10">
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${preview==="guide" ? "bg-white" : ""}`}
                            onClick={()=> setPreview("guide")}
                          >
                            가이드
                          </div>
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${preview==="essay" ? "bg-white" : ""}`}
                            onClick={()=> setPreview("essay")}
                          >
                            자기소개서
                          </div>
                        </div>
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
                          placeholder="오류가 발생했습니다. 다시 시도해주세요."
                          disabled
                          className={genStyles.guideCtn}
                        />
                    )}
                </div>
              )}
            </div>
            
            <div className="sm:px-8 flex justify-between mt-4">
              {currentStep == 1 && (
                <button
                  onClick={() => {
                    // if(!userHasPaid && freePassUsed){
                    //   setPaywall(true)
                    // } else{
                      setCurrentStep(currentStep + 1)
                    // } 
                  }}
                  className={revStyles.btn}
                  disabled = {!selectedJob || !selectedQuestionKey}
                >
                  자기소개서 생성 시작하기
                </button>
              )} 
              {currentStep == 2 && (
                <>
                  <button 
                    onClick={() => {
                      setCurrentStep(currentStep - 1)
                      setLastStep(false)
                    }}
                    className="px-5 py-2 bg-gray-300 text-[0.8rem] rounded-[8px] disabled:text-gray-500"
                    disabled={waiting || running}
                  >
                    이전
                  </button>
                  {!lastStep ? (
                    <button
                      onClick={handleNextStep}
                      className={revStyles.btn}
                      disabled={waiting || running}
                    >
                      다음
                    </button>
                  ) : (
                    <button
                      data-track="generate-click"
                      onClick={handleSubmit}
                      className={revStyles.btn}
                      disabled={waiting || running}
                    >
                      자기소개서 생성하기
                    </button>
                  )
                  
                }
                  
                </>
              )}
              {currentStep == 3 && essay && !running && (
                <div className="w-full grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center py-2 border border-dark/20 rounded-lg hover:bg-dark/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    자기소개서 복사하기
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex items-center justify-center py-2 border border-dark/20 rounded-lg hover:bg-dark/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    다시 생성
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* {paywall && (
            <>
              <div className={genStyles.paywallOverlay}></div>
              <div className={genStyles.paywallMessage}>
                <h2 className="text-[1.5rem] font-extrabold pb-4">🔒 프리미엄 콘텐츠입니다</h2>
                <Paywall />
              </div>
            </>
          )} */}
        </div>
      </div>
    </AuthCheck>
  );
};

export default function GenerationPageWrapper() {
  const params = useParams();
  const [companyData, setCompanyData] = useState<[string, string] | null>(null);

  useEffect(() => {
    if (params?.company_data) {
      try {
        const decoded = decodeURIComponent(params.company_data as string);
        const [company, title] = decoded.split('_xyz');
        setCompanyData([company, title]);
      } catch (e) {
        console.error('Decoding error', e);
      }
    }
  }, [params]);

  if (!companyData) return <Loading />;

  const [company, title] = companyData;
  return <GenerationDynamicPage company={company} title={title} />;
}