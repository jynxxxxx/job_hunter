'use client'

import React, { useState, useRef, useEffect } from "react";
import AuthCheck from "@/components/AuthCheck";
import { Feedback, Revision } from "@/types/forms";
import { generateFeedback, generateRevision } from "@/app/api/generate";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "@/styles/revisions.module.scss"
import { useAuth } from "@/context/AuthContext";
import Paywall from "@/components/Paywall";
import genStyles from "@/styles/generation.module.scss"
import { DotSpinner } from "@/components/layoutSections/DotSpinner";
import { Copy, RefreshCw } from "lucide-react";
import ProgressIndicator from "@/components/layoutSections/ProgressIndicator";

export default function RevisionPage() {
  const {authUser} = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [followupAnswers, setFollowupAnswers] = useState<string[]>([]);
  const [finalEssay, setFinalEssay] = useState<Revision | null>(null);
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [jobUrl, setJobUrl] = useState('');
  const [waiting1, setWaiting1] = useState(false);
  const [waiting2, setWaiting2] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [tab, setTab] = useState("essay");

  useEffect(() => {
    if (waiting2 && !running) {
      stageSetRef.current = [
        { text: '고객님의 정보를 안전하게 접수했습니다.', duration: 2000 + Math.random() * 1000 },
        { text: '입력하신 내용을 분석 중입니다.', duration: 8000 + Math.random() * 5000 },
        { text: `${companyInput} 합격 자기소개서 데이터를 참고하고 있습니다.`, duration: 8000 + Math.random() * 5000 },
        { text: '고객님 맞춤형 자기소개서 첨삭 진행중 입니다.', duration: 10000 + Math.random() * 5000 },
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

  const handleSubmitDraft = async (e: any) => {
    e.preventDefault();

    setCurrentStep(currentStep + 1)

    const input = {
      company_name: companyInput,
      job_title: jobInput,
      question_text: questionInput,
      question_number: "",
      url: jobUrl,
      essay_draft: draft,
    };

    setWaiting1(true)
    
    try {
      const feedback = await generateFeedback(input)
      setFeedback(feedback);
    } catch (err) { 
      console.error("Error getting feedback:", err);
      toast.error('피드백 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
    setWaiting1(false)
    }
  };

  const handleSeeQuestions = async (e: any) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("로그인이 필요합니다.");
      setWaiting2(false);
      return;
    }

    const userRef = doc(db, "users", authUser?.uid);
    const userSnap = await getDoc(userRef);

    const hasSubscribed = userSnap.exists() && userSnap.data().subscription?.active === true;
    const freePassUsed = userSnap.exists() && userSnap.data().revision_count > 0;

    if (!hasSubscribed && freePassUsed) {
      setPaywall(true);
      return;
    }

    setCurrentStep(currentStep + 1)
  }

  const handleSubmitFollowup = async (e: any) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("로그인이 필요합니다.");
      setWaiting2(false);
      return;
    }

    const userRef = doc(db, "users", authUser?.uid);
    const userSnap = await getDoc(userRef);

    const hasSubscribed = userSnap.exists() && userSnap.data().subscription?.active === true;
    const freePassUsed =  userSnap.exists() && userSnap.data().revision_count > 0
    
    if (!hasSubscribed && freePassUsed) {
      toast.error("접근이 제한되었습니다. 이 콘텐츠를 이용하시려면 결제가 필요합니다.");
      return;
    }

    if (!hasSubscribed) {
      // meta conversion api call
      await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          eventSourceUrl: window.location.href,
          email: authUser?.email, // optional
          customData: {
            content_name: '프리 자기소개서 첨삭 클릭', // or any relevant label
          },
        }),
      });
    } 

    setCurrentStep(currentStep + 1)

    const input = {
      company_name: companyInput,
      job_title: jobInput,
      question_text: questionInput,
      question_number: "",
      url: jobUrl,
      essay_draft: draft,
      additional_user_input: Object.values(followupAnswers)
    };
    
    setWaiting2(true)

    let revision
    try {
      revision = await generateRevision(input)
      setFinalEssay(revision);
    } catch (err) { 
      console.error("Error submitting follow up:", err);
      setRunning(false)
      toast.error('최종 자소서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setWaiting2(false)   
    }

    await addDoc(collection(db, "users", authUser.uid, "revisions"), {
      createdAt: serverTimestamp(),
      ...input,
      feedback: feedback?.feedback,
      additional_questions: feedback?.additional_info_request.questions,
      revision: revision.revised_essay,
      revision_explanation: revision.revision_explanation
    });

      await updateDoc(userRef, {
      ['revision_count']: increment(1),
    });
  };

  const handleRestart = () => {
    setDraft('');
    setFeedback(null);
    setFollowupAnswers([]);
    setFinalEssay(null);
    setCompanyInput("");
    setJobInput("");
    setCurrentStep(1)
    setQuestionInput("");
    setJobUrl('');
  };

  const handleCopy = () => {
    if (!finalEssay) {
      toast.error("복사 실패 했습니다!");
      return
    }
    navigator.clipboard.writeText(finalEssay. revised_essay);
    toast.success("복사되었습니다!");
  };

  return (
    <AuthCheck>
      <div className="min-h-[80vh] bg-primary/30">
        <div className={`w-[90vw] md:w-[60vw] mx-auto pb-12 ${currentStep==1 ? "2xl:w-2/5" : "2xl:w-1/2"}`}>
          <div className='flex flex-col items-center justify-center pt-8'>
            <div className='text-gray-700 font-bold text-2xl pt-12'>자기소개서 첨삭</div>
          </div>
          <div className="h-fit">
            <div className="container mx-auto px-4 pt-8">
              <div className="max-w-3xl mx-auto">
                <ProgressIndicator currentStep={currentStep} totalSteps={4}/>
              </div>
            </div>
          </div>
          <div className="bg-white px-2 sm:px-8 py-8 rounded-lg border border-gray-300">
            <h2 className="text-3xl font-bold text-center">
              {currentStep==1 && "지원 정보 입력"}
              {currentStep==2 && "자소서 피드백"}
              {currentStep==3 && "세부 질문 답변"}
              {currentStep==4 && "자기소개서 완성"}
            </h2>

            <div className="min-h-4/5 sm:px-8 sm:pt-8">
              {currentStep === 1 && (
                <form id="basicInfoForm" onSubmit={handleSubmitDraft} className={styles.sectionctn}>
                  <div className="w-full flex items-center gap-2">
                    <label className="w-[5ch] min-w-[5ch]">회사:</label>
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
                    <label className="w-[5ch] min-w-[5ch] min-">직무:</label>
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
                    <label className="w-[5ch] min-w-[5ch]">문항:</label>
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
                    <label className="w-[5ch] min-w-[5ch]">URL:</label>
                    <input
                        type="text"
                        value={jobUrl}
                        onChange={e => setJobUrl(e.target.value)}
                        placeholder="공고 url 입력하세요 (선택 사항)"
                        className={styles.formField}
                      />
                  </div>
                  <div className="w-full flex gap-2">
                    <label className="w-[5ch] min-w-[5ch]">초안:</label>
                    <textarea
                      rows={6}
                      placeholder="자기소개서 초안을 입력하세요"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className={styles.formField}
                      required
                    />
                  </div>
                </form>
              )}
              { currentStep === 2 && (
                <div className={`relative ${styles.sectionctn}`}>
                  {waiting1 ? (
                    <>
                      <div className="whitespace-pre-wrap space-y-4 p-8 text-gray-700 text-base leading-relaxed blur-sm select-none pointer-events-none">            
                        <h2 className="text-lg font-bold">
                          초안 분석 중이에요! 곧 피드백과 보완을 위한 추가 질문을 드릴게요.
                          <div className="h-px sm:hidden"><br /></div>
                          (선택 사항)
                        </h2>
                        <div className="space-y-8">
                          <div>
                            {[...Array(3)].map((_, idx) => (
                              <div key={idx}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                          <div>
                            {[...Array(3)].map((_, idx) => (
                              <div key={idx}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                          <div>
                            {[...Array(3)].map((_, idx) => (
                              <div key={idx}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="absolute z-10 flex flex-col justify-center items-center w-full">
                        <div className='w-full pt-[2rem] text-center drop-shadow-[0_0_4px_white]'>초안 분석 중이에요! 곧 피드백과 보완을 위한 추가 질문을 드릴게요. <br /> 잠시만 기다려주세요 (최대 1분)</div>
                        <div className='w-full pt-8 pb-16'><DotSpinner /></div>
                      </div>
                    </>
                  ) : (
                    <div className="border border-gray-200 rounded-lg py-8 px-10" >
                      <ul className="list-disc space-y-8 leading-relaxed">
                        {feedback?.feedback.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 3 && (
                Array.isArray(feedback?.additional_info_request?.questions) &&
                feedback.additional_info_request.questions.length > 0 && (
                  <>
                    <h2 className="mb-6 text-lg font-bold">
                      추가 질문으로 더 정교하게 보완하기
                      &nbsp;<div className="h-px sm:hidden"><br/></div>
                      (선택 사항)
                    </h2>
                    <div className="space-y-4">
                      {feedback?.additional_info_request.questions.map((q, idx) => (
                        <div key={idx}>
                          <label className="block font-medium mb-1">{q}</label>
                          <textarea
                            rows={3}
                            placeholder=""
                            value={followupAnswers[idx] || ''}
                            onChange={(e) => setFollowupAnswers({ ...followupAnswers, [idx]: e.target.value })}
                            className={`w-full ${styles.formField}`}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}

              {currentStep === 4 && (
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
                    finalEssay && (
                      <>
                        <div className="mt-6 grid w-full grid-cols-3 mb-6 py-1 px-1 rounded-lg items-center justify-center bg-dark/10">
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${tab==="essay" ? "bg-white" : ""}`}
                            onClick={()=> setTab("essay")}
                          >
                            최종 결과
                          </div>
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${tab==="explanation" ? "bg-white" : ""}`}
                            onClick={()=> setTab("explanation")}
                          >
                            수정 이유 설명
                          </div>
                          <div 
                            className={`text-center py-2 rounded-lg cursor-pointer ${tab==="answers" ? "bg-white" : ""}`}
                            onClick={()=> setTab("answers")}
                          >
                            질문 답변
                          </div>
                        </div>
                        {tab ==="essay" &&
                        <div className="whitespace-pre-wrap border rounded p-4 bg-gray-50 mb-4">
                          {finalEssay.revised_essay}
                        </div>
                        }
                        {tab === "explanation" && (
                          <div className="min-h-[30vh] space-y-6 border border-gray-200 rounded-xl p-8">
                            <ul className="list-disc pl-6 space-y-1 mb-12">
                              {finalEssay.revision_explanation.map((exp, idx) => (
                                <li key={idx}>{exp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {tab === "answers" && (
                          <div className="space-y-6 border border-gray-200 rounded-xl p-8">
                            {feedback?.additional_info_request.questions.map((question, idx) => {
                              const answer = followupAnswers[idx] || "";

                              return (
                                <div key={idx} className="pb-4 border-b border-gray-300">
                                  <div className="font-semibold mb-1">{question}</div>
                                  <div className="whitespace-pre-wrap p-2">
                                    {answer || <span className="text-gray-400 italic">답변 없었습니다</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="sm:px-8 flex justify-between mt-4">
              {currentStep == 1 && (
                <button
                  form="basicInfoForm"
                  type="submit"
                  className={styles.btn}
                  disabled={waiting1}
                >
                  피드백 받기
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
                    onClick={handleSeeQuestions} 
                    className={styles.btn}
                    disabled={waiting2}
                  >
                    추가 질문 확인하기
                  </button>
                </>
              )}
              {currentStep == 3 && (
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
              {currentStep == 4 && finalEssay && !running && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
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
        </div>
      </div>

      {paywall && (
        <>
          <div className={genStyles.paywallOverlay}></div>
          <div className={`relative ${genStyles.paywallMessage}`}>
            <h2 className="text-[1.5rem] font-extrabold pb-4">🔒 프리미엄 콘텐츠입니다</h2>
            <Paywall />
            <button
              onClick={()=> setPaywall(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </AuthCheck>
  );
}

            