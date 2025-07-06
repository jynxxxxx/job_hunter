'use client';

import React, { useState } from "react";
import HistoryPage from "@/components/tabs/HistoryPage";
import { useUserData } from "@/context/UserDataContext";
import { companyList } from "@/data"; // adjust path as needed
import { useRouter } from "next/navigation";

const uniqueCompanies = Array.from(new Set(companyList.map(item => item.company)));

export default function JobSelectPage() {
  const { activePage } = useUserData()
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState("");
  const jobOptions = companyList.filter(item => item.company === selectedCompany);

  const [selectedJob, setSelectedJob] = useState("");
  const [showGeneration, setShowGeneration] = useState(false);

  // Update job options when company changes
  const handleCompanyChange = (e: any) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setSelectedJob("");
  };

  const handleJobChange = (e: any) => {
    setSelectedJob(e.target.value);
  };
  return (
    <div className="w-[80vw] mx-auto">
      <div className="">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCL9-ITtmBGavKou4DgUgJibUFVHfn0McY_Cd_dTV-kfNhYGYE6z2Wijyjx-1WDBAyHJKqEZqpc0gGBGmvguQ0ofskhXdYX6QwfaowcerjVeOwHNhPcCyivt6qs90XBXMb1oAzZfO9ihpYbEXkDVM0kBXXR4lp14-_5ZL77aYJB1xuWJMSgQqImyw52bZoUXndNatLoWhW5L3v0yBD1wZMYihdNoZ9AHQOq6gm-9yM8YROLvnQ7uZyAn_UHDKpexyQ6Vi6EqVsqClMS")`
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1
              className="text-white mt-8 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
            > 
              AI로 돋보이는 자기소개서를 작성하세요
            </h1>
            <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              지원하는 회사와 직무에 맞춰 당신의 강점과 경험을 돋보이게 하는 맞춤형 에세이를 생성하세요.
            </h2>
          </div>
          {/* <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#0b79ee] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
            onClick={() => setShowGeneration(true)}
            disabled={!selectedCompany || !selectedJob}
          >
            <span className="truncate">Get Started</span>
          </button> */}
        </div>
      </div>
      <h1
        className="mt-8 text-4xl leading-tight tracking-[-0.033em] font-extrabold"
      > 
        회사 및 직무 선택해주세요
      </h1>
      <div className="flex gap-4 px-4 w-[80%] items-center mt-4">
        <div className="w-1/2">
          <select
            value={selectedCompany || ""}
            onChange={handleCompanyChange}
            className="border rounded px-3 py-2 text-[1.3rem] w-full"
          >
            <option value="" disabled hidden>회사 선택</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <select
            value={selectedJob || ""}
            onChange={handleJobChange}
            disabled={!selectedCompany}
            className="border rounded px-3 py-2 text-[1.3rem] w-full"
          >
            <option value="" disabled hidden>직무/공고 선택</option>
            {jobOptions.map(item => (
              <option key={item.job_description} value={item.job_description}>{item.job_description}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push(`/generation/${encodeURIComponent(selectedCompany)}/${encodeURIComponent(selectedJob)}`)}
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
          {companyList.map((item, idx) => {
            // Assume item.start and item.deadline are ISO strings or undefined
            const now = new Date();
            const start = item.start ? new Date(item.start) : undefined;
            const deadline = item.deadline ? new Date(item.deadline) : undefined;
            const isPastDeadline = deadline && now > deadline;
            return (
              <div
                key={item.company + item.job_description + idx}
                className={`border rounded-xl shadow-md p-6 flex flex-col gap-2 transition cursor-pointer bg-white hover:shadow-lg ${isPastDeadline ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                onClick={() => {
                  if (!isPastDeadline) router.push(`/generation/${encodeURIComponent(item.company)}/${encodeURIComponent(item.job_description)}`)
                }}
              >
                <div className="text-lg font-bold text-dark">{item.company}</div>
                <div className="text-md text-gray-700">{item.job_description}</div>
                {start && (
                  <div className="text-xs text-gray-500">{start.toLocaleDateString()} - {deadline?.toLocaleDateString()}</div>
                )}
                <button
                  className={`mt-2 px-4 py-1 bg-bright text-white rounded-lg w-fit self-end hover:scale-103 transition-all duration-200 ${isPastDeadline ? 'opacity-60 grayscale pointer-events-none' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (!isPastDeadline) router.push(`/generation/${encodeURIComponent(item.company)}/${encodeURIComponent(item.job_description)}`)
                  }}
                  disabled={isPastDeadline}
                >
                  {isPastDeadline ? '마감됨' : '바로가기'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}