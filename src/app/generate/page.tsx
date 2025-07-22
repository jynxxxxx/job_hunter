'use client';

import React, { useState } from "react";
import { useUserData } from "@/context/UserDataContext";
import { useRouter } from "next/navigation";
import { getQuestionTemplate } from '@/components/HelperFunctions';
import RequestForm from "@/components/RequestForm";
import { finished } from "@/templates/finished_Jobs";
import AuthCheck from "@/components/AuthCheck";
import { parseCustomEndDate } from "@/components/HelperFunctions";
import revStyles from "@/styles/revisions.module.scss"
import { imageMap } from "@/templates/imageMap";
import Image from "next/image";

export default function JobBoard() {
  const { jobList, jobTemplates } = useUserData();
  const router = useRouter();
  const [jobInput, setJobInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [characterCount,setCharacterCount] = useState("");
  const [jobUrl, setJobUrl] = useState('');
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

  const uniqueCompanies: any[] = Array.from(
    activeJobs
      .filter(item => {
        const template = getQuestionTemplate(String(item.job_id), jobTemplates);
        return !!template;
      })
      .reduce((map, item) => {
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
      .values()
  );

  const expiredJobs = [
    ...jobList
      .filter(item => {
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

  const handlePickCompany = (e: any, company: any) => {
    e.preventDefault();
    router.push(`/generate/${company.company}_xyz${company.title}`);
  };

  const handleSubmitBasicInfo = (e: any) => {
    e.preventDefault();
    sessionStorage.removeItem('openGenData');
    sessionStorage.removeItem('openGenDataTimestamp');
    
    const formData = {
      company: companyInput,
      job: jobInput,
      question: questionInput,
      characterCount: characterCount,
      url: jobUrl,
    };

    // Save to sessionStorage
    sessionStorage.setItem('openGenData', JSON.stringify(formData));
    // Save timestamp for expiry
    sessionStorage.setItem('openGenDataTimestamp', Date.now().toString());

    router.push('/generate/open');
  };


  return (
    <AuthCheck>
      <div className="w-[80vw] mx-auto">
        <div className="flex flex-col gap-2 pt-8 pb-4 text-center">
          <h1
            className="text-gray-700 mt-4 sm:mt-8 text-2xl md:text-4xl leading-tight tracking-[-0.033em] font-extrabold"
          > 
            AI로 돋보이는 자기소개서를&nbsp;<div className="h-px sm:hidden"><br/></div>작성하세요
          </h1>
        </div>

        <h1
          className="text-center mb-2 mt-4 sm:mt-8 text-2xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          지원하는 회사, 직무, 자소서 문항만 입력하면 바로지원 AI가 도와드립니다.
        </h1>
        <div className={`${revStyles.section} sm:w-3/5 2xl:w-1/2 mx-auto`}>
          <form onSubmit={handleSubmitBasicInfo} className="px-2 sm:px-8 pt-6 pb-4 flex flex-col gap-2">
            <div className="w-full flex items-center gap-2">
              <label className="w-[7ch]">회사:</label>
              <input
                type="text"
                value={companyInput}
                onChange={e => setCompanyInput(e.target.value)}
                placeholder="회사를 입력하세요"
                className={revStyles.formField}
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
                className={revStyles.formField}
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
                className={revStyles.formField}
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
                className={`${revStyles.formField} noticker`}
              />
            </div>
            <div className="w-full flex items-center gap-2">
              <label className="w-[7ch]">URL:</label>
              <input
                type="text"
                value={jobUrl}
                onChange={e => setJobUrl(e.target.value)}
                placeholder="공고 url 입력하세요 (선택 사항)"
                className={revStyles.formField}
              />
            </div>
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className={revStyles.btn}
              >
                자기소개서 생성 시작하기
              </button>
            </div>
          </form>
        </div>

        <h1
          className="text-center mb-2 mt-8 text-2xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          인기 기업 공고를 한 곳에서 쉽게 확인하고 바로 시작하세요.
        </h1>
        <div>
          <div className="mb-8 space-y-4 grid">
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-0 sm:mb-4 items-stretch`}>
              {uniqueCompanies.map((company, idx) => {
                const companyImageSrc = imageMap[company.company as keyof typeof imageMap];
                return (
                  <div 
                    key={idx} 
                    className="rounded-xl shadow h-full items-stretch"
                  >
                    <button
                      onClick={(e) => handlePickCompany(e, company)}
                      className={`rounded-xl shadow logo relative border rounded-xl w-full h-full hover:scale-103 text-left p-4 font-semibold text-lg flex flex-col gap-2 justify-center items-center bg-white`}
                    >
                      {companyImageSrc && (
                        <div className="relative min-h-[3rem] md:min-h-[4rem] w-[90%] py-2">
                          <Image
                            src={companyImageSrc}
                            alt={`${company} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="text-sm">{company.title}</div>
                      <div className="text-center text-xs font-normal text-gray-500">{company.startDate} - {company.endDate}</div>
                    </button>
                  </div>
                )
              })}
            </div>
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