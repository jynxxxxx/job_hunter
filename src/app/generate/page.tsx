'use client';

import React, { useState, useRef, useEffect } from "react";
import AuthCheck from "@/components/AuthCheck";
import { EssayOutputProps, SubQuestions } from "@/types/forms";
import { generateFreeEssay, generateSubQuestions } from "@/app/api/generate";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "@/styles/revisions.module.scss"
import { DotSpinner } from "@/components/layoutSections/DotSpinner";
import { useAuth } from "@/context/AuthContext";
import genStyles from "@/styles/generation.module.scss"
import ProgressIndicator from "@/components/layoutSections/ProgressIndicator";
import { Copy, RefreshCw } from "lucide-react";

type BasicInfoInput = {
  company_name: string;
  job_title: string;
  question_text: string;
  url: string;
  target_length: string;
};

export default function GenerationOpenPage() {
  const {authUser} = useAuth()
  const [currentStep, setCurrentStep] = useState(2)
  const [subQuestions, setSubQuestions] = useState<SubQuestions | null>(null);
  const [followupAnswers, setFollowupAnswers] = useState<Record<string, { free_text: string }>>({});
  const [finalEssay, setFinalEssay] = useState<EssayOutputProps | null>(null);
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [characterCount,setCharacterCount] = useState("");
  const [jobUrl, setJobUrl] = useState('');
  const [waiting1, setWaiting1] = useState(false);
  const [waiting2, setWaiting2] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  // const [paywall, setPaywall] = useState(false);
  const [tab, setTab] = useState("essay");

  useEffect(() => {
    if (!authUser) {
      return;
    }

    const dataString = sessionStorage.getItem('openGenData');
    const timestampString = sessionStorage.getItem('openGenDataTimestamp');

    if (dataString && timestampString) {
      const data = JSON.parse(dataString);
      const timestamp = Number(timestampString);

      // Clear if older than 5 minutes (300,000 ms)
      if (Date.now() - timestamp > 300000) {
        sessionStorage.removeItem('openGenData');
        sessionStorage.removeItem('openGenDataTimestamp');
        return;
      }

      if (data.company && data.job && data.question) {
        setJobUrl(data.url || '');
        setCompanyInput(data.company);
        setJobInput(data.job);
        setQuestionInput(data.question);
        setCharacterCount(data.characterCount)

        submitBasicInfo({
          company_name: data.company,
          job_title: data.job,
          question_text: data.question,
          url: data.url,
          target_length: data.characterCount,
        })
      } else {
        setCurrentStep(1)
      }
    } else {
      setCurrentStep(1)
    }
  }, [authUser]);

  useEffect(() => {
    if (waiting2 && !running) {
      stageSetRef.current = [
        { text: '고객님의 정보를 안전하게 접수했습니다.', duration: 2000 + Math.random() * 1000 },
        { text: '입력하신 내용을 분석 중입니다.', duration: 8000 + Math.random() * 5000 },
        { text: `${companyInput} 합격 자기소개서 데이터를 참고하고 있습니다.`, duration: 8000 + Math.random() * 5000 },
        { text: '고객님 맞춤형 자기소개서 가이드를 작성하고 있습니다.', duration: 10000 + Math.random() * 5000 },
        { text: '최종 결과물을 준비 중입니다. 곧 확인하실 수 있습니다.', duration: 12000 + Math.random() * 5000 }
      ];
      setRunning(true);
      setStageIndex(0);
    }
  }, [waiting2, running, companyInput]);

  useEffect(() => {
    if (!running || !stageSetRef.current) return;
    const stages = stageSetRef.current;
    if (stageIndex >= stages.length - 1) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      setStageIndex(stageIndex + 1);
    }, stages[stageIndex].duration);
    return () => clearTimeout(timer);
  }, [running, stageIndex]);

  const submitBasicInfo = async (data?: Partial<BasicInfoInput>) => {
    if (!authUser) {
      toast.error("로그인이 필요합니다.");
      setWaiting2(false);
      return;
    }

    // const userRef = doc(db, "users", authUser?.uid);
    // const userSnap = await getDoc(userRef);

    // const hasSubscribed = userSnap.exists() && userSnap.data().subscription?.active === true;
    // const freePassUsed =  userSnap.exists() && ((userSnap.data().generation_count?.['open'] ?? 0) > 0);

    // if (!hasSubscribed && freePassUsed) {
    //   setPaywall(true)
    //   return;
    // }

    const input = {
      company_name: data?.company_name ?? companyInput,
      job_title: data?.job_title ?? jobInput,
      question_text: data?.question_text ?? questionInput,
      url: data?.url ?? jobUrl,
      target_length: data?.target_length ?? characterCount,
    };

    setWaiting1(true)

    try {
      const subq = await generateSubQuestions(input)
      setSubQuestions(subq);
    } catch (err) { 
      console.error("Error getting subQuestions:", err);
      toast.error('피드백 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
    setWaiting1(false)
    }
  };

  const handleSubmitBasicInfo = async (e: any) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1)
    await submitBasicInfo();
  };

  const handleSubmitFollowup = async (e: any) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("로그인이 필요합니다.");
      setWaiting2(false);
      return;
    }

    const userRef = doc(db, "users", authUser?.uid);
    const userSnap = await getDoc(userRef);

    // const hasSubscribed = userSnap.exists() && userSnap.data().subscription?.active === true;
    // const freePassUsed =  userSnap.exists() && ((userSnap.data().generation_count?.['open'] ?? 0) > 0);
    
    // if (!hasSubscribed && freePassUsed) {
    //   toast.error("접근이 제한되었습니다. 이 콘텐츠를 이용하시려면 결제가 필요합니다.");
    //   return;
    // }

    if (userSnap.exists() && (userSnap.data().generation_count?.['open'] ?? 0) < 1) {
      // meta conversion api call
      await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          eventSourceUrl: window.location.href,
          email: authUser?.email, // optional
          customData: {
            content_name: '프리 자기소개서 생성 클릭', // or any relevant label
          },
        }),
      });
    } 

    const input = {
      ...subQuestions,
      user_input: followupAnswers,
      target_length: characterCount,
    };

    setCurrentStep(currentStep + 1)
    setWaiting2(true)

    let essay
    try {
      essay = await generateFreeEssay(input)
      setFinalEssay(essay);
    } catch (err) { 
      console.error("Error submitting follow up:", err);
      setRunning(false)
      toast.error('최종 자소서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setWaiting2(false)   
    }

    await addDoc(collection(db, "users", authUser.uid, "generations"), {
      createdAt: serverTimestamp(),
      input: {
        subquestions: Object.values(input.subquestion?.["1"]?.sub_question_list ?? {}).map(
        (item) => item.sub_question
        ),
        user_input: Object.values(followupAnswers).map((ans) => ans.free_text),
      },
      essay: essay.essay,
      job_id: 'open',
      question_text: questionInput,
      company_name: companyInput,
      job_title: jobInput,
      target_length: characterCount,
      url: jobUrl,
    });

     await updateDoc(userRef, {
      [`generation_count.open`]: increment(1),
    });

    sessionStorage.removeItem('openGenData');
    sessionStorage.removeItem('openGenDataTimestamp');
  };

  const handleRestart = () => {
    setSubQuestions(null);
    setFollowupAnswers({});
    setFinalEssay(null);
    setCompanyInput("");
    setJobInput("");
    setQuestionInput("");
    setCharacterCount("");
    setJobUrl("");
    setCurrentStep(1)
    setTab("essay")
  };

  const handleCopy = () => {
    if (!finalEssay) {
      toast.error("복사 실패 했습니다!");
      return
    }
    navigator.clipboard.writeText(finalEssay.essay);
    toast.success("복사되었습니다!");
  };

  return (
    <AuthCheck>
      <div className="min-h-[80vh] bg-primary/30">
        <div className={`w-[90vw] md:w-[60vw] mx-auto pb-12 ${currentStep==1 ? "2xl:w-1/3" : "2xl:w-1/2"}`}>
          <div className='flex flex-col items-center justify-center pt-8'>
            <div className='text-gray-700 font-bold text-2xl pt-12'>자기소개서 생성</div>
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
            <div className="min-h-4/5 sm:px-8 sm:pt-8">
              {currentStep === 1 &&
                <form id="basicInfoForm" onSubmit={handleSubmitBasicInfo} className={styles.sectionctn}>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[7ch]">회사:</label>
                    <input
                      type="text"
                      value={companyInput}
                      onChange={e => setCompanyInput(e.target.value)}
                      placeholder="회사를 입력하세요"
                      className={styles.formField}
                      required
                    />
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[7ch]">직무:</label>
                    <input
                      type="text"
                      value={jobInput}
                      onChange={e => setJobInput(e.target.value)}
                      placeholder="직무를 입력하세요"
                      className={styles.formField}
                      required
                    />
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[7ch]">문항:</label>
                    <input
                      type="text"
                      value={questionInput}
                      onChange={e => setQuestionInput(e.target.value)}
                      placeholder="문항을 입력하세요"
                      className={styles.formField}
                      required
                    />
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[7ch]">글자수:</label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      value={characterCount}
                      onChange={e => setCharacterCount(e.target.value)}
                      placeholder="원하는 자소서 글자 수 입력하세요 (예: 700)"
                      className={`${styles.formField} noticker`}
                    />
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[7ch]">URL:</label>
                    <input
                      type="text"
                      value={jobUrl}
                      onChange={e => setJobUrl(e.target.value)}
                      placeholder="공고 url 입력하세요 (선택 사항)"
                      className={styles.formField}
                    />
                  </div>
                </form>
              }     
              {currentStep === 2 &&
                <div className={`relative ${styles.sectionctn}`}>
                  {waiting1 ? (
                    <>
                      <div className="whitespace-pre-wrap space-y-4 p-8 text-gray-700 text-base leading-relaxed blur-sm select-none pointer-events-none">            
                        <h2 className="text-lg font-bold">
                          추가 질문으로 더 정교하게 보완하기
                          <div className="h-px sm:hidden"><br /></div>
                          (선택 사항)
                        </h2>
                        <div className="space-y-4">
                          {[...Array(3)].map((_, idx) => (
                            <div key={idx}>
                              <div className="h-4 w-2/3 bg-gray-300 rounded mb-2 animate-pulse" />
                              <div className="h-20 border border-gray-200 rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute z-10 flex flex-col justify-center items-center w-full">
                        <div className='w-full pt-[2rem] text-center drop-shadow-[0_0_4px_white]'>추가 질문 생성하는중입니다 <br /> 잠시만 기다려주세요 (최대 1분)</div>
                        <div className='w-full pt-4 pb-16'><DotSpinner /></div>
                      </div>
                    </>
                  ) : (
                    subQuestions ? (
                      subQuestions?.subquestion?.["1"] &&
                        Object.keys(subQuestions.subquestion["1"].sub_question_list || {}).length > 0 && (
                        <>
                          <h2 className="text-lg font-bold">
                            추가 질문으로 더 정교하게 보완하기
                            &nbsp;<div className="h-px sm:hidden"><br/></div>
                            (선택 사항)
                          </h2>
                          <div className="space-y-4">
                            {Object.entries(subQuestions.subquestion["1"].sub_question_list).map(([key, item]) => (
                              <div key={key}>
                                <label className="block font-medium mb-1">{item.sub_question}</label>
                                <textarea
                                  rows={3}
                                  placeholder={item.suggested_inputs?.join(', ') || ''}
                                  value={followupAnswers[key]?.free_text || ''}
                                  onChange={(e) => 
                                    setFollowupAnswers((prev) => ({
                                      ...prev,
                                      [key]: {
                                        free_text: e.target.value,
                                      },
                                    }))
                                  }
                                  className={`${styles.formField} w-full`}
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )
                    ) : (
                      <div className="flex flex-col justify-center items-center">
                        <div className='w-full py-[2rem] text-center'>
                          추가 질문을 생성하는 중 오류가 발생했습니다.<br/>
                          이전 단계로 돌아가 다시 시도해 주세요.
                        </div>
                      </div>
                    )
                  )}
                </div>
              }

              {currentStep === 3 &&
                <div className={`relative ${styles.sectionctn}`}>
                  {waiting2 && running ? (
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
                    finalEssay ? (
                      <>
                        <div className="mt-6 grid w-full grid-cols-2 mb-6 py-1 px-1 rounded-lg items-center justify-center bg-dark/10">
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${tab==="essay" ? "bg-white" : ""}`}
                            onClick={()=> setTab("essay")}
                          >
                            최종 결과
                          </div>
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${tab==="answers" ? "bg-white" : ""}`}
                            onClick={()=> setTab("answers")}
                          >
                            질문 답변
                          </div>
                        </div>
                        {tab ==="essay" &&
                          <div className="whitespace-pre-wrap border border-gray-200 rounded-xl p-8">
                            {finalEssay.essay}
                            <div className='w-[fit-content] mt-4 ml-auto text-gray-400'>{finalEssay?.length}자</div>
                          </div>
                        }
                        {tab === "answers" && (
                          <div className="space-y-6 border border-gray-200 rounded-xl p-8">
                            {subQuestions?.subquestion?.["1"] &&
                              Object.entries(subQuestions.subquestion["1"].sub_question_list || {}).map(([key, item]) => (
                                <div key={key} className="pb-4 border-b border-gray-300">
                                  <h3 className="font-semibold mb-1">{item.sub_question}</h3>
                                  <div className="whitespace-pre-wrap p-2">
                                    {followupAnswers[key]?.free_text || <span className="text-gray-400 italic">답변 없었습니다</span>}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <textarea
                        value=""
                        placeholder="오류가 발생했습니다. 다시 시도해주세요."
                        disabled
                        className={genStyles.guideCtn}
                      />
                    )
                  )}
                </div>
              }
            </div>
            <div className="sm:px-8 flex justify-between mt-4">
              {currentStep == 1 && (
                <button
                  form="basicInfoForm"
                  type="submit"
                  className={styles.btn}
                  disabled={waiting1}
                >
                  자기소개서 생성 시작하기
                </button>
              )} 
              {currentStep == 2 && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(currentStep - 1)} 
                    className="px-5 py-2 bg-gray-300 text-[0.8rem] rounded-[8px] disabled:text-gray-500"
                    disabled={waiting1 || waiting2}
                  >
                    이전
                  </button>

                  <button
                    data-track="generate-click"
                    onClick={handleSubmitFollowup}
                    className={styles.btn}
                    disabled={waiting2}
                  >
                    최종 자소서 생성
                  </button>
                </>
              )}
              {currentStep == 3 && finalEssay &&  (
                <div className="w-full grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center py-2 border border-dark/20 rounded-lg hover:bg-dark/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    복사하기
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
}