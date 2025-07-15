'use client'

import React, { useState, useRef, useEffect } from "react";
import { useUserData } from "@/context/UserDataContext";
import AuthCheck from "@/components/AuthCheck";
import { parseCustomEndDate, scrollToElementWithOffset } from "@/components/HelperFunctions";
import { Feedback, Revision } from "@/types/forms";
import { generateFeedback, generateRevision } from "@/app/api/generate";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "@/styles/revisions.module.scss"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useAuth } from "@/context/AuthContext";
import Paywall from "@/components/Paywall";
import genStyles from "@/styles/generation.module.scss"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { DotSpinner } from "@/components/layoutSections/DotSpinner";

export default function RevisionPage() {
  const {authUser} = useAuth()
  const { jobList, jobTemplates } = useUserData();
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupAnswers, setFollowupAnswers] = useState<string[]>([]);
  const [finalEssay, setFinalEssay] = useState<Revision | null>(null);
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [openStep, setOpenStep] = useState<number[]>([1]);
  const [questionInput, setQuestionInput] = useState("");
  const [jobUrl, setJobUrl] = useState('');
  const [waiting1, setWaiting1] = useState(false);
  const [waiting2, setWaiting2] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const step2Ref = useRef<HTMLDetailsElement | null>(null);
  const step3Ref = useRef<HTMLDetailsElement | null>(null);
  const [paywall, setPaywall] = useState(false);

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

    const input = {
      company_name: companyInput,
      job_title: jobInput,
      question_text: questionInput,
      question_number: "",
      url: jobUrl,
      essay_draft: draft,
    };

    setOpenStep(prev => [...new Set([...prev, 2])]);
    setWaiting1(true)
    setTimeout(() => {
      scrollToElementWithOffset(step2Ref, 0.3)
    }, 100);
    
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

    setShowFollowup(true);
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
    
    const input = {
      company_name: companyInput,
      job_title: jobInput,
      question_text: questionInput,
      question_number: "",
      url: jobUrl,
      essay_draft: draft,
      additional_user_input: Object.values(followupAnswers)
    };
    
    setOpenStep(prev => [...new Set([...prev, 3])]);
    setWaiting2(true)
    setTimeout(() => {
      scrollToElementWithOffset(step3Ref, 0.3)
    }, 100);

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

    });

      await updateDoc(userRef, {
      ['revision_count']: increment(1),
    });
  };

  const handleRestart = () => {
    setDraft('');
    setFeedback(null);
    setShowFollowup(false);
    setFollowupAnswers([]);
    setFinalEssay(null);
    setCompanyInput("");
    setJobInput("");
    setOpenStep([1]);
    setQuestionInput("");
    setJobUrl('');

    window.scrollTo({top:0, behavior: 'smooth',});
  };

  const toggleStep = (step: number) => {
    setOpenStep(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const stepDisabled = (step: number) => {
    if (step === 2) return !(waiting1 || feedback);
    if (step === 3) return !(waiting2 || finalEssay);
    return false;
  };

  return (
    <AuthCheck>
      <div className="w-[90vw] md:w-[70vw] mx-auto">
        <div className="flex flex-col gap-2 pt-4 pb-4 text-center">
          <h1
            className="text-bright mt-8 text-2xl md:text-4xl leading-tight tracking-[-0.033em] font-extrabold"
          > 
            당신의 자소서, 정말 &apos;합격 수준&apos; 인지&nbsp;<div className="h-px sm:hidden"><br/></div>확인해 보세요.
          </h1>
          <h2 className="py-4 text-bright text-lg md:text-2xl font-normal leading-normal ">
            삼성-SK 하이닉스 인사팀 출신 전문가의 노하우와 3,000건의 합격자소서를 기반으로, 합격률을 높이는 자소서로 완성하세요.
          </h2>
        </div>

        {/* Step 1 */}
        <details open={openStep.includes(1)} className={styles.section}>
          <summary
            className="cursor-pointer font-semibold px-4 py-2 bg-primary"
            onClick={() => toggleStep(1)}
          >
            1단계: 회사/직무 선택 및 초안 입력
          </summary>
          <form onSubmit={handleSubmitDraft} className={styles.sectionctn}>
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
            <div className="w-full flex flex-row sm:flex-col items-center gap-2">
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
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className={styles.btn}
                disabled={waiting1}
              >
                피드백 받기
              </button>
            </div>
          </form>
        </details>

        {/* Step 2 */}
        <details ref={step2Ref} open={openStep.includes(2)} className={`${styles.section} ${stepDisabled(2) ? 'opacity-50 pointer-events-none' : ''}`}>
          <summary
            className="cursor-pointer font-semibold px-4 py-2 bg-primary"
            onClick={() => !stepDisabled(2) && toggleStep(2)}
          >
            2단계: AI 피드백 확인 및 선택적 보완
          </summary>
          <div className={styles.sectionctn}>
            {waiting1 ? (
              <div className="flex flex-col justify-center items-center">
                <div className='w-full pt-[2rem] text-center'>추가 질문 생성하는중입니다 <br /> 잠시만 기달려주세요</div>
                <div className='w-full pt-8 pb-16'><DotSpinner /></div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold">피드백</h2>
                <Swiper
                  modules={[Navigation, Pagination]}
                  loop
                  navigation
                  pagination={{ clickable: true }}
                  className={`w-full mx-auto mb-[1.5rem] md:mb-0 ${styles.custom_swiper}`}
                  spaceBetween={75}
                >
                  {feedback && feedback.feedback.map((msg, i) => (
                    <SwiperSlide key={i} className="border rounded border-box px-4 py-2 bg-white">
                      <div className="pb-8">{msg}</div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {feedback?.additional_info_request?.needs_additional_info && (
                  <button
                    onClick={handleSeeQuestions}
                    className={styles.btn}
                  >
                    추가 질문 보기
                  </button>
                )}
              </>
            )}

            {showFollowup && 
              Array.isArray(feedback?.additional_info_request?.questions) &&
              feedback.additional_info_request.questions.length > 0 && (
                <>
                  <h2 className="mt-16 mb-6 text-lg font-bold">
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
                    <div className="flex justify-end w-full">
                      <button
                        onClick={handleSubmitFollowup}
                        className={styles.btn}
                        disabled={waiting2}
                      >
                        자기소개서 첨삭 하기
                      </button>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </details>

        {/* Step 3 */}
        <details ref={step3Ref} open={openStep.includes(3)} className={`${styles.section} ${stepDisabled(3) ? 'opacity-50 pointer-events-none' : ''}`}>
          <summary
            className="cursor-pointer font-semibold px-4 py-2 bg-primary"
            onClick={() => !stepDisabled(3) && toggleStep(3)}
          >
            3단계: 최종 자기소개서 확인
          </summary>
          <div className={styles.sectionctn}>
            {waiting2 && running ? (
              <div className="flex flex-col justify-center items-center">
                <div className='w-full pt-[2rem] text-center'>{stageSetRef.current?.[stageIndex].text}</div>
                <div className='w-full pt-8 pb-16'><DotSpinner /></div>
              </div>
            ) : (
              finalEssay && (
                <>
                  <h2 className="text-lg font-bold mb-2">완성된 자기소개서</h2>
                  <div className="whitespace-pre-wrap border rounded p-4 bg-gray-50 mb-4">
                    {finalEssay.revised_essay}
                  </div>
                  <h3 className="text-lg font-bold">수정 이유 설명</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {finalEssay.revision_explanation.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                </>
              )
            )}
          </div>
        </details>
        { finalEssay && 
          <div className="flex justify-end">
            <button 
              onClick={handleRestart} 
              className="my-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              처음부터 다시 시작
            </button>
          </div>
        }
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
      </div>
    </AuthCheck>
  );
}
