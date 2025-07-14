'use client'

import React, { useState, useEffect, useRef } from "react";
import { useUserData } from "@/context/UserDataContext";
import AuthCheck from "@/components/AuthCheck";
import { parseCustomEndDate } from "@/components/HelperFunctions";
import { useAuth } from "@/context/AuthContext";
import { Feedback, Revision } from "@/types/forms";
import { generateFeedback } from "../api/generate";
import { toast } from "sonner";
import styles from "@/styles/revisions.module.scss"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const feedbackTestData1: Feedback = {
  feedback: [
    "지원 동기가 회사 인재상과 충분히 연결되지 않아 보입니다.",
    "프로젝트 경험은 좋으나, 본인의 정확한 역할과 기여도가 모호합니다.",
    "수치화된 성과 제시가 없어 설득력이 부족합니다."
  ],
  additional_info_request: {
    needs_additional_info: true, // Additional info IS needed for this case
    reason: "직무 관련 프로젝트에서 지원자의 구체적인 역할과 기여도를 명확히 파악하기 위함입니다. 또한, 성과를 수치화할 수 있는 정보가 필요합니다.",
    questions: [
      "참여했던 '데이터 분석 프로젝트'에서 당신의 주요 역할은 무엇이었나요?",
      "그 프로젝트에서 당신의 기여로 인해 어떤 구체적인 수치적 성과(예: 효율성 개선 몇 %, 비용 절감 얼마)가 있었나요?",
      "당시 팀원들과의 협업 과정에서 가장 기억에 남는 어려움과 해결 과정은 무엇이었나요?"
    ]
  }
};

const revisionTestData1: Revision = {
  revised_essay: `[리라이팅된 자기소개서 내용 1]\n\n저는 끊임없는 호기심과 분석적 사고를 바탕으로 데이터가 가진 잠재력을 탐구해왔습니다. 특히, 대학 시절 'AI 기반 추천 시스템 개발' 프로젝트를 통해, 팀원들과 협력하여 사용자 만족도를 15% 향상시키는 데 기여했습니다. 이 경험을 통해 데이터로부터 유의미한 인사이트를 도출하고 실제 서비스 개선에 기여하는 역량을 길렀습니다. 귀사의 '데이터 사이언티스트' 직무에서 이러한 저의 역량을 발휘하여 혁신적인 성과를 창출하고 싶습니다.`,
  revision_explanation: [
    "도입부를 회사 비전과 연결하여 지원 동기를 강화했습니다.",
    "경험 서술 시 STAR 기법을 적용하여 문제점, 행동, 성과를 명확히 제시했습니다.",
    "구체적인 수치(사용자 만족도 15% 향상)를 삽입하여 성과의 설득력을 높였습니다.",
    "불필요한 수식어를 제거하고 간결하고 명확한 문장으로 수정하여 가독성을 높였습니다."
  ]
};

export default function RevisionPage() {
  const { authUser } = useAuth()
  const { jobList, jobTemplates } = useUserData();
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupAnswers, setFollowupAnswers] = useState<string[]>([]);
  const [finalEssay, setFinalEssay] = useState<Revision | null>(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [openStep, setOpenStep] = useState<number[]>([1]);
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [customCompany, setCustomCompany] = useState('');
  const [customJob, setCustomJob] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [waiting1, setWaiting1] = useState(false);
  const [waiting2, setWaiting2] = useState(false);

  const jobOptions = selectedCompany === '자유입력'
    ? []
    : jobList.filter(item => item.company === selectedCompany);

  const now = new Date();
  const activeJobs = jobList.filter(item => !item.endDate || parseCustomEndDate(item.endDate) >= now)
    .sort((a, b) => {
      const aIsSK = a.company.toLowerCase().includes('sk');
      const bIsSK = b.company.toLowerCase().includes('sk');

      // Primary Sort: 'SK' companies first
      // If 'a' is an SK company and 'b' is not, 'a' comes before 'b' (return -1)
      if (aIsSK && !bIsSK) {
        return -1;
      }
      // If 'a' is not an SK company and 'b' is, 'a' comes after 'b' (return 1)
      if (!aIsSK && bIsSK) {
        return 1;
      }

      const dateA = a.endDate ? new Date(a.endDate) : new Date('9999-12-31'); // Put jobs without endDate at the end
      const dateB = b.endDate ? new Date(b.endDate) : new Date('9999-12-31');

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime(); // Soonest endDate first
      }

      const companyCompare = b.company.localeCompare(a.company);
      if (companyCompare !== 0) return companyCompare;

      return a.title.localeCompare(b.title);
    });

  const uniqueCompanies = Array.from(
    new Set(
      activeJobs
        .map(item => item.company)
    )
  );

  // Update job options when company changes
  const handleCompanyChange = (e: any) => {
    const company = e.target.value;
    setSelectedCompany(company);
    if(company =='자유입력'){
      setSelectedJob('자유입력');
      setSelectedQuestion('자유입력');
    } else {
      setSelectedJob(null);
      setSelectedQuestion('');
    }
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [title, position] = e.target.value.split('|||');
    console.log(e.target.value)
    if (e.target.value == '자유입력') {
      setSelectedJob('자유입력');
      setSelectedQuestion('자유입력');
    } else {
      const job = jobOptions.find(item => item.title === title && item.position === position);
      console.log("job",job)
      if (job) {
        setSelectedJob(job);
      }
    }
    setSelectedQuestion('');
  };

  const selectedJobTemplate = jobTemplates.find(t => t.job_id == selectedJob?.job_id);
  console.log('selected', selectedJobTemplate)
  const questionOptions = selectedJobTemplate && selectedJob !== '자유입력'
    ? Object.entries(selectedJobTemplate)
      .filter(([key]) => key.startsWith('question'))
      .map(([key, text]) => ({ key, text: String(text) }))
      .sort((a, b) => {
        const cleanA = a.key.replace(/^question/, '');
        const cleanB = b.key.replace(/^question/, '');

        const isNumberA = /^\d+$/.test(cleanA);
        const isNumberB = /^\d+$/.test(cleanB);
        const isAlphaA = /^[a-zA-Z가-힣\s]+$/.test(cleanA);
        const isAlphaB = /^[a-zA-Z가-힣\s]+$/.test(cleanB);

        // Case 1: both alpha
        if (isAlphaA && isAlphaB) {
          return cleanA.localeCompare(cleanB, 'ko');
        }

        // Case 2: both numbers
        if (isNumberA && isNumberB) {
          return parseInt(cleanA) - parseInt(cleanB);
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
        return cleanA.localeCompare(cleanB, 'ko');
      })
    : [];
  
  const handleSubmitDraft = async (e: any) => {
    e.preventDefault();
    // const input = {
    //   company_name: selectedCompany == "자유입력" ? customCompany : selectedJob.company,
    //   job_title: selectedJob == "자유입력" ? customJob : selectedJob.position,
    //   question_number: selectedQuestion == "자유입력" ? customQuestion : selectedQuestion.replace(/^question/, ''),
    //   // url: jobUrl,
    //   essay_draft: draft,
    // };
    // setWaiting1(true)
    // try {
    // const feedback = await generateFeedback(input)
    // setFeedback(feedback);
    // console.log("feedback", feedback)
    // setOpenStep(prev => [...new Set([...prev, 2])]);
    // } catch (err) { 
    //   toast.error('피드백 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    // } finally {
    // setWaiting1(false)
    // }
    setFeedback(feedbackTestData1)
    setOpenStep(prev => [...new Set([...prev, 2])]);
  };

  const handleSubmitFollowup = async (e: any) => {
    e.preventDefault();

    const input = {
      company_name: selectedCompany == "자유입력" ? customCompany : selectedJob.company,
      job_title: selectedJob == "자유입력" ? customJob : selectedJob.position,
      question_number: selectedQuestion == "자유입력" ? customQuestion : selectedQuestion.replace(/^question/, ''),
      url: jobUrl,
      essay_draft: draft,
      additional_user_input: followupAnswers
    };
    // setWaiting2(true)
    // try {
    //   const revision = await generateFeedback(input)
    //   setFinalEssay(revision);
    //   setOpenStep(prev => [...new Set([...prev, 3])]);
    // } catch (err) { 
    //   toast.error('피드백 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    // } finally {
    //   setWaiting2(false)   
    // }

    setFinalEssay(revisionTestData1)
    setOpenStep(prev => [...new Set([...prev, 3])]);
  };

  const toggleStep = (step: number) => {
    setOpenStep(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const stepDisabled = (step: number) => {
    if (step === 2) return !feedback;
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
            당신의 자소서, 정말 '합격 수준' 인지&nbsp;<div className="h-px sm:hidden"><br/></div>확인해 보세요.
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
          <form onSubmit={handleSubmitDraft} className={styles.sectionctn}>
            <div className="w-full">
              <select
                value={selectedCompany || ""}
                onChange={handleCompanyChange}
                className={styles.formField}
                required
              >
                <option value="" disabled hidden>회사 선택</option>
                {uniqueCompanies.map(company => (
                  <option className={styles.formOption} key={company} value={company}>{company}</option>
                ))}
                <option className={styles.formOption} key="자유입력" value="자유입력">자유입력</option>
              </select>
              {selectedCompany === '자유입력' && (
                <input
                  type="text"
                  value={customCompany}
                  onChange={e => {
                    console.log(e.target.value)
                    setCustomCompany(e.target.value)}
                  }
                  placeholder="회사를 입력하세요"
                  className={styles.formField}
                  required
                />
              )}
            </div>
            <div className="w-full">
              <select
                value={
                  selectedJob === '자유입력'
                    ? '자유입력'
                    : selectedJob
                      ? `${selectedJob.title}|||${selectedJob.position}`
                      : ""
                }
                onChange={handleJobChange}
                disabled={!selectedCompany}
                className={styles.formField}
                required
              >
                <option value="" disabled hidden>직무/공고 선택 (회사 먼저 선택 해주세요)</option>
                {jobOptions.map(item => (
                  <option 
                    className={styles.formOption} 
                    key={`${item.title}-${item.position}`} 
                    value={`${item.title}|||${item.position}`}
                  >
                    {item.title} ({item.position})
                  </option>
                ))}
                <option className={styles.formOption} key="자유입력" value="자유입력">자유입력</option>
              </select>
              {selectedJob === '자유입력' && (
                <input
                  type="text"
                  value={customJob}
                  onChange={e => setCustomJob(e.target.value)}
                  placeholder="직무를 입력하세요"
                  className={styles.formField}
                  required
                />
              )}
            </div>  
            <div>
              <select
                value={selectedQuestion}
                onChange={(e) => {setSelectedQuestion(e.target.value)
                  console.log('question:', e.target.value)}
                }
                className={styles.formField}
                disabled={!selectedJob}
                required
              >
                <option value="" disabled hidden>문항 선택 (직무 선택 해주세요)</option>
                {questionOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {/^\d+$/.test(opt.key.replace(/^question/, '')) ? `${opt.key.replace(/^question/, '')}번 문항:` : `${opt.key.replace(/^question/, '')} 문항:`} {opt.text}
                  </option>
                ))}
                <option className={styles.formOption} key="자유입력" value="자유입력">자유입력</option>
              </select>
              {selectedQuestion === '자유입력' && (
                <input
                  type="text"
                  value={customQuestion}
                  onChange={e => setCustomQuestion(e.target.value)}
                  placeholder="문항을 입력하세요"
                  className={styles.formField}
                  required
                />
              )}
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
            <div className="w-full">
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
            2단계: AI 피드백 확인 및 선택적 보완
          </summary>

            
          <div className={styles.sectionctn}>
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
                onClick={() => setShowFollowup(true)}
                className={styles.btn}
              >
                추가 질문 쓰기
              </button>
            )}

            {showFollowup && 
            Array.isArray(feedback?.additional_info_request?.questions) &&
            feedback.additional_info_request.questions.length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-bold">
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
                  {finalEssay.revised_essay}
                </div>
                <h3 className="text-lg font-bold">수정 이유 설명</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {finalEssay.revision_explanation.map((exp, idx) => (
                    <li key={idx}>{exp}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </details>
      </div>
    </AuthCheck>
  );
}
