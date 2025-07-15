'use client';

import React, { useState, useEffect, useRef } from "react";
import { useUserData } from "@/context/UserDataContext";
import { useRouter } from "next/navigation";
import { getQuestionTemplate } from '@/components/HelperFunctions';
import RequestForm from "@/components/RequestForm";
import { finished } from "@/templates/finished_Jobs";
import genStyles from "@/styles/generation.module.scss";
import AuthCheck from "@/components/AuthCheck";
import { parseCustomEndDate } from "@/components/HelperFunctions";

// Helper to generate a random 6-character string
function randomId() {
  return Math.random().toString(36).substring(2, 8);
}

const imageMap: { [key: string]: string } = {
  "포스코스틸리온": "/company_logos/posco.svg",
  "LG에너지솔루션": "/company_logos/lg_logo.png",
  "SK하이닉스": "/company_logos/sk_hynix.png",
  "롯데건설":"/company_logos/lotte_gunsul.png",
}

export default function JobBoard() {
  const { jobList, jobTemplates } = useUserData();
  const jobContainerRef = useRef<HTMLDivElement | null>(null);
  const [openCompany, setOpenCompany] = useState<string|null>(null);
  const [columns, setColumns] = useState(1); // default to desktop
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [initialized, setInitialized] = useState(false);
  const jobOptions = jobList.filter(item => item.company === selectedCompany);
  const hasInteracted = useRef(false);
  const [selectedJob, setSelectedJob] = useState<any>("");

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1); // sm
      } else if (window.innerWidth < 770) {
        setColumns(2); // md
      } else {
        setColumns(3); // lg and up
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Only companies with at least one job that has a question template
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

  const expiredJobs = [
    ...jobList.filter(item => {
      const itemEndDateObj = parseCustomEndDate(item.endDate);
      if (isNaN(itemEndDateObj?.getTime())) {
        return false; 
      }
      return itemEndDateObj < now;
    }).reduce((map, item) => {
      const key = `${item.company}-${item.title}`;
      if (!map.has(key)) {
        map.set(key, {
          company: item.company,
          title: item.title,
          startDate: item.startDate,
          endDate: item.endDate,
        });
      }
      return map;
    }, new Map<string, { company: string; title: string; startDate?: string; endDate?: string }>())
    .values(),
    ...finished
  ];

  const groupedByCompany: Record<string, any[]> = activeJobs.reduce((acc, job) => {
    if (!acc[job.company]) acc[job.company] = [];
    acc[job.company].push(job);
    return acc;
  }, {});

  useEffect(() => {
    if (!initialized && Object.keys(groupedByCompany).length > 0 && columns > 1) {
      setOpenCompany(Object.keys(groupedByCompany)[0]);
      setInitialized(true); // Prevent future auto-setting
    }
  }, [groupedByCompany, initialized, columns]);

  function chunkArray<T>(arr: T[], size: number): T[][] {
    return arr.reduce((acc, _, i) => {
      return i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc;
    }, [] as T[][]);
  }

  const companyChunks = chunkArray(Object.entries(groupedByCompany), columns);

  const uniqueCompanies = Array.from(
    new Set(
      activeJobs
        .filter(item => {
          const template = getQuestionTemplate(String(item.job_id), jobTemplates);
          if (!template) return false;
          return true
        })
        .map(item => item.company)
    )
  );

  // Update job options when company changes
  const handleCompanyChange = (e: any) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setSelectedJob("");
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [title, position] = e.target.value.split('|||');
    const job = jobOptions.find(item => item.title === title && item.position === position);
    if (job) {
      setSelectedJob(job); // Save full object
    }
  };

  useEffect(() => {
    if (!hasInteracted.current) return;
    if (!jobContainerRef.current) return;

    const element = jobContainerRef.current;

    // Delay is necessary to allow layout/render to finish
    const timeout = setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementCenter = rect.top + scrollY + rect.height / 2;
      const offsetFromTop = window.innerHeight / 3;
      const scrollTo = elementCenter - offsetFromTop;


      window.scrollTo({
        top: scrollTo,
      });
    }, 200); // Delay matters!

    return () => clearTimeout(timeout);
  }, [openCompany]);

  return (
    <AuthCheck>
      <div className="w-[80vw] mx-auto">
        <div className="flex flex-col gap-2 pt-8 pb-4 text-center">
          <h1
            className="text-bright mt-8 text-2xl md:text-4xl leading-tight tracking-[-0.033em] font-extrabold"
          > 
            AI로 돋보이는 자기소개서를&nbsp;<div className="h-px sm:hidden"><br/></div>작성하세요
          </h1>
          <h2 className="pt-4 text-bright text-lg md:text-2xl font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
            삼성-SK 하이닉스 인사팀 출신 전문가와 AI연구원이 만든 서비스로 기업 맞춤형 자기소개서가 완성됩니다
          </h2>
        </div>
        <h1
          className="mt-8 text-2xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          회사 및 직무 선택해주세요
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 w-[100%] lg:items-center mt-4">
          <div className="w-full lg:w-1/2">
            <select
              value={selectedCompany || ""}
              onChange={handleCompanyChange}
              className="border rounded px-3 py-2 text-md w-full"
            >
              <option value="" disabled hidden>회사 선택</option>
              {uniqueCompanies.map(company => (
                <option className="text-md" key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-full">
            <select
              value={
                selectedJob && selectedJob !== '자유입력'
                  ? `${selectedJob.title}|||${selectedJob.position}`
                  : ""
              }
              onChange={handleJobChange}
              disabled={!selectedCompany}
              className="border rounded px-3 py-2 text-md w-full"
            >
              <option value="" disabled hidden>직무/공고 선택 (회사 먼저 선택 해주세요)</option>
              {jobOptions.map(item => (
                <option 
                  className="text-md" 
                  key={`${item.title}-${item.position}`} 
                  value={`${item.title}|||${item.position}`}
                >
                  {item.title} ({item.position})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (selectedJob) {
                const rand = randomId();
                router.push(`/generate/trending/${selectedJob.job_id}xY_${rand}`);
              }
            }}
            className="min-w-[fit-content] text-md px-5 py-2 bg-primary rounded-2xl hover:bg-primary/80 hover:scale-103 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-extrabold"
          >
            자기소개서 생성하기
          </button>
        </div>


        <div>
          <div className="my-8 space-y-4">
            {companyChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-0 sm:mb-4 items-stretch`}>
                {chunk.map(([company]) => {
                  const companyImageSrc = imageMap[company as keyof typeof imageMap];

                  return (
                    <div 
                      key={company} 
                      className="rounded-xl shadow h-full items-stretch"
                      ref={(company === openCompany) ? jobContainerRef : null}
                    >
                      <button
                        onClick={() => {
                          hasInteracted.current = true;
                          setOpenCompany(openCompany === company ? null : company)
                        }}
                        className={`rounded-xl shadow logo relative border rounded-xl w-full h-full hover:scale-103 text-left p-4 font-semibold text-lg flex flex-col gap-2 sm:gap-4 justify-center items-center ${openCompany === company ? 'bg-gray-200 scale-103' : "bg-gray-100 "}`}
                      >
                        {companyImageSrc && (
                          <img
                            src={companyImageSrc}
                            alt={`${company} logo`}
                            className="h-[6rem] lg:h-[8rem] w-[90%] object-contain pb-8 pt-2 sm:pt-4" 
                          />
                        )}
                        <span className="absolute bottom-4">{openCompany === company ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )
                })}
                <div className={`col-span-full w-full bg-white border-t border-gray-300 p-6 shadow-inner ${genStyles.jobBoard} ${openCompany && chunk.some(([c]) => c === openCompany) ? genStyles.open  : ""}`}>
                  {chunk.some(([c]) => c === openCompany) && openCompany && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {groupedByCompany[openCompany].map((item: any, idx: any) => {
                        const template = getQuestionTemplate(String(item.job_id), jobTemplates);
                        const isComingSoon = template ? false : true; // Assuming template is defined if coming soon
                        const rand = randomId();
                        return (
                          <div
                            key={item.company + item.title + idx}
                            className={`relative border rounded-xl shadow-md p-6 flex flex-col gap-2 transition cursor-pointer bg-white hover:shadow-lg ${isComingSoon ? 'opacity-70' : ''}`}
                            onClick={() => {
                              if (!isComingSoon) router.push(`/generate/trending/${item.job_id}xY_${rand}`)
                            }}
                          >
                            {isComingSoon && (
                              <div className="absolute top-0 right-0 bg-bright text-white text-s font-bold px-4 py-1 rounded-tr-xl rounded-bl-xl z-10">
                                곧 출시됩니다
                              </div>
                            )}
                            <div className="text-lg font-bold text-dark">{item.company}</div>
                            <div className="text-md text-gray-700">{item.title}</div>
                            <div className="text-md font-medium text-gray-700">{item.position}</div>
                            {item.startDate && (
                              <div className="text-xs text-gray-500">{item.startDate} - {item.endDate}</div>
                            )}
                            <button
                              className={`mt-2 px-4 py-1 text-white rounded-lg w-fit self-end bg-bright ${isComingSoon ? "" : 'hover:scale-103'} transition-all duration-200 `}
                              onClick={e => {
                                e.stopPropagation();
                                if (!isComingSoon) router.push(`/generate/trending/${item.job_id}xY_${rand}`)
                              }}
                              disabled={isComingSoon}
                            >
                              {isComingSoon ? '준비중' : '바로가기'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 pb-8 sm:pb-16">
          <h1
            className="mt-12 text-2xl leading-tight tracking-[-0.033em] font-extrabold"
          > 
            원하는 공고가 없나요? 필요한 자소서를 요청해 보세요.
          </h1>
          <RequestForm />
        </div>

        <div>
          <h1
            className="mt-8 sm:mt-12 text-2xl leading-tight tracking-[-0.033em] font-extrabold"
          > 
            마감된 기업 및 직무
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8 max-h-[30vh] md:max-h-[50vh] overflow-y-scroll">
            {expiredJobs.map((item, idx) => {
              return (
                <div
                  key={item.company + item.title + idx}
                  className={`relative border rounded-xl shadow-md p-6 flex flex-col gap-2 transition cursor-pointer bg-white hover:shadow-lg opacity-50 grayscale pointer-events-none`}
                >
                  <div className="text-lg font-bold text-dark">{item.company}</div>
                  <div className="text-md text-gray-700">{item.title}</div>
                  {item.startDate && (
                    <div className="text-xs text-gray-500">{item.startDate} - {item.endDate}</div>
                  )}
                  <button
                    className={`mt-2 px-4 py-1 text-white rounded-lg w-fit self-end bg-bright opacity-60 grayscale pointer-events-none`}
                    disabled
                  >
                    마감됨
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}