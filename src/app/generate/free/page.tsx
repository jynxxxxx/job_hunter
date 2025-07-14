'use client'

import React, { useState } from "react";
import AuthCheck from "@/components/AuthCheck";
import { EssayOutputProps, Revision, SubQuestions } from "@/types/forms";
import { generateFreeEssay, generateSubQuestions } from "@/app/api/generate";
import { toast } from "sonner";
import styles from "@/styles/revisions.module.scss"

export default function FreeGenerationPage() {
  const [subQuestions, setSubQuestions] = useState<SubQuestions | null>(null);
  const [followupAnswers, setFollowupAnswers] = useState<Record<string, { free_text: string }>>({});
  const [finalEssay, setFinalEssay] = useState<EssayOutputProps | null>(null);
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [openStep, setOpenStep] = useState<number[]>([1]);
  const [questionInput, setQuestionInput] = useState("");
  const [jobUrl, setJobUrl] = useState('');
  const [waiting1, setWaiting1] = useState(false);
  const [waiting2, setWaiting2] = useState(false);
  
  const handleSubmitBasicInfo = async (e: any) => {
    e.preventDefault();
    const input = {
      company_name: companyInput,
      job_name: jobInput,
      question_text: questionInput,
      url: jobUrl,
    };
    setWaiting1(true)
    try {
      const subq = await generateSubQuestions(input)
      setSubQuestions(subq);
      console.log("subQuestions", subq)
      setOpenStep(prev => [...new Set([...prev, 2])]);
    } catch (err) { 
      console.error("Error getting subQuestions:", err);
      toast.error('피드백 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
    setWaiting1(false)
    }
  };

  const handleSubmitFollowup = async (e: any) => {
    e.preventDefault();

    const input = {
      ...subQuestions,
      user_input: followupAnswers
    };
    console.log("input",input)
    setWaiting2(true)
    try {
      const revision = await generateFreeEssay(input)
      setFinalEssay(revision);
      setOpenStep(prev => [...new Set([...prev, 3])]);
    } catch (err) { 
      console.error("Error submitting follow up:", err);
      toast.error('최종 자소서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setWaiting2(false)   
    }
  };

  const toggleStep = (step: number) => {
    setOpenStep(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const stepDisabled = (step: number) => {
    if (step === 2) return !subQuestions;
    if (step === 3) return !finalEssay;
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
            삼성-SK 하이닉스 인사팀 출신 전문가의 날카로운 분석과 AI의 정교한 수정으로, 당신의 자소서를 합격 공식에 맞춰 완벽하게 개선하세요.
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
          <form onSubmit={handleSubmitBasicInfo} className={styles.sectionctn}>
            <div className="w-full">
              <input
                type="text"
                value={companyInput}
                onChange={e => setCompanyInput(e.target.value)}
                placeholder="회사를 입력하세요"
                className={styles.formField}
                required
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                value={jobInput}
                onChange={e => setJobInput(e.target.value)}
                placeholder="직무를 입력하세요"
                className={styles.formField}
                required
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                placeholder="문항을 입력하세요"
                className={styles.formField}
                required
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                value={jobUrl}
                onChange={e => setJobUrl(e.target.value)}
                placeholder="공고 url 입력하세요"
                className={styles.formField}
              />
            </div>
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className={styles.btn}
                disabled={waiting1}
              >
                자기소개서 첨삭하기
              </button>
            </div>
          </form>
        </details>

        {/* Step 2 */}
        <details open={openStep.includes(2)} className={`${styles.section} ${stepDisabled(2) ? 'opacity-50 pointer-events-none' : ''}`}>
          <summary
            className="cursor-pointer font-semibold px-4 py-2 bg-primary"
            onClick={() => !stepDisabled(2) && toggleStep(2)}
          >
            2단계: 조금더 나 답게
          </summary>

            
          <div className={styles.sectionctn}>
            {subQuestions?.subquestion?.["1"] &&
              Object.keys(subQuestions.subquestion["1"].sub_question_list || {}).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-bold">
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
                        className={styles.formField}
                      />
                    </div>
                  ))}
                  <div className="flex justify-end w-full">
                    <button
                      onClick={handleSubmitFollowup}
                      className={styles.btn}
                      disabled={waiting2}
                    >
                      최종 자소서 생성
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </details>

        {/* Step 3 */}
        <details open={openStep.includes(3)} className={`${styles.section} ${stepDisabled(3) ? 'opacity-50 pointer-events-none' : ''}`}>
          <summary
            className="cursor-pointer font-semibold px-4 py-2 bg-primary"
            onClick={() => !stepDisabled(3) && toggleStep(3)}
          >
            3단계: 최종 자소서 확인
          </summary>
          <div className={styles.sectionctn}>
            {finalEssay && (
              <>
                <h2 className="text-lg font-bold mb-2">완성된 자소서</h2>
                <div className="whitespace-pre-wrap border rounded p-4 bg-gray-50 mb-4">
                  {finalEssay.essay}
                </div>
              </>
            )}
          </div>
        </details>
      </div>
    </AuthCheck>
  );
}
