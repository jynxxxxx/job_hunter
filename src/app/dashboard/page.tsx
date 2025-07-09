'use client';

import React, { useState } from "react";
import { useUserData } from "@/context/UserDataContext";
import { useRouter } from "next/navigation";
import { getQuestionTemplate } from '@/components/HelperFunctions';
import RequestForm from "@/components/RequestForm";
import { finished } from "@/templates/finished_Jobs";

// Helper to generate a random 6-character string
function randomId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function Dashboard() {
  const { jobList } = useUserData();
  // Only companies with at least one job that has a question template

  const now = new Date();
  const activeJobs = jobList.filter(item => !item.endDate || new Date(item.endDate) >= now)
  .sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date('9999-12-31'); // Put jobs without endDate at the end
    const dateB = b.endDate ? new Date(b.endDate) : new Date('9999-12-31');

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime(); // Soonest endDate first
    }

    const companyCompare = a.company.localeCompare(b.company);
    if (companyCompare !== 0) return companyCompare;

    return a.title.localeCompare(b.title);
  });

  const expiredJobs = [
    ...jobList.filter(item => item.endDate && new Date(item.endDate) < now),
    ...finished
  ];


  const uniqueCompanies = Array.from(
    new Set(
      activeJobs
        .filter(item => {
          const template = getQuestionTemplate(String(item.job_id));
          console.log("Template for job_id:", item.job_id, "is", template);
          if (!template) return false;
          return true
        })
        .map(item => item.company)
    )
  );

  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState("");
  const jobOptions = jobList.filter(item => item.company === selectedCompany);

  const [selectedJob, setSelectedJob] = useState("");

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
  // Find the selected job object
  const selectedJobObj: any = selectedJob

  return (
    <div className="w-[80vw] mx-auto">
      <div className="">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          style={{
            borderRadius: "4rem",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/bg_image.png")`
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1
              className="text-white mt-8 text-3xl md:text-5xl leading-tight tracking-[-0.033em] font-extrabold"
            > 
              AI로 돋보이는 자기소개서를 작성하세요
            </h1>
            <h2 className="pt-4 text-white text-lg md:text-2xl font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              지원하는 회사와 직무에 맞춰 당신의 강점과 경험을 돋보이게 하는 맞춤형 자기소개서를 생성하세요.
            </h2>
          </div>
        </div>
      </div>
      <h1
        className="mt-8 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
      > 
        회사 및 직무 선택해주세요
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 lg:px-4 w-[100%] lg:w-[80%] lg:items-center mt-4">
        <div className="w-full lg:w-1/2">
          <select
            value={selectedCompany || ""}
            onChange={handleCompanyChange}
            className="border rounded px-3 py-2 text-[1.3rem] w-full"
          >
            <option value="" disabled hidden>회사 선택</option>
            {uniqueCompanies.map(company => (
              <option className="text-[1rem]" key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div className="w-full lg:w-1/2">
          <select
            value={selectedJob || ""}
            onChange={handleJobChange}
            disabled={!selectedCompany}
            className="border rounded px-3 py-2 text-[1.3rem] w-full"
          >
            <option value="" disabled hidden>직무/공고 선택 (회사 먼저 선택 해주세요)</option>
            {jobOptions.map(item => (
              <option 
                className="text-[1rem]" 
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
            if (selectedJobObj) {
              const rand = randomId();
              router.push(`/generation/${selectedJobObj.job_id}xY_${rand}`);
            }
          }}
          className="min-w-[fit-content] px-5 py-2 bg-primary text-bold rounded-2xl hover:bg-primary/80 hover:scale-103 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          자기소개서 생성하기
        </button>
      </div>


      <div>
        <h1
          className="mt-12 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          지원 가능한 기업 및 직무
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
          {activeJobs.map((item, idx) => {
            const template = getQuestionTemplate(String(item.job_id));
            const isComingSoon = template ? false : true; // Assuming template is defined if coming soon
            const rand = randomId();
            return (
              <div
                key={item.company + item.title + idx}
                className={`relative border rounded-xl shadow-md p-6 flex flex-col gap-2 transition cursor-pointer bg-white hover:shadow-lg ${isComingSoon ? 'opacity-70' : ''}`}
                onClick={() => {
                  if (!isComingSoon) router.push(`/generation/${item.job_id}xY_${rand}`)
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
                    if (!isComingSoon) router.push(`/generation/${item.job_id}xY_${rand}`)
                  }}
                  disabled={isComingSoon}
                >
                  {isComingSoon ? '준비중' : '바로가기'}
                </button>
              </div>
            );
          })}
        </div>

        <h1
          className="mt-12 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          마감된 기업 및 직무
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
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

      <div className="pt-8 pb-16">
        <h1
          className="mt-12 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
        > 
          원하는 공고가 없나요? 필요한 자소서를 요청해 보세요.
        </h1>
        <RequestForm />
      </div>
    </div>
  )
}