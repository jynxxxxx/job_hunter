'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import { getQuestionTemplate } from '@/questionTemplates';
import DynamicQuestionSection from '@/components/DynamicQuestionSection';
import genStyles from "@/styles/generation.module.scss";
import GuideResult from '@/components/layoutSections/GuideResults';
import { HyundaiEssayOutputProps, GuideOutputProps } from '@/types/forms';
import { DotSpinner } from '@/components/layoutSections/DotSpinner';

export default function GenerationDynamicPage({ params }: { params: Promise<{ company: string; job: string }> }) {
  const { company: encodedCompany, job: encodedJob } = React.use(params);
  const company = decodeURIComponent(encodedCompany);
  const job = decodeURIComponent(encodedJob);
  console.log(`Company: ${company}, Job: ${job}`);
  const template = getQuestionTemplate(company, job);
  const sectionKeys = template ? Object.keys(template).filter((k) => /^q\d+$/.test(k)) : [];
  const [activeTab, setActiveTab] = useState(sectionKeys[0] || '');
  const [guide, setGuide] = useState<any>(null);
  const [essay, setEssay] = useState<any>(null);
  const [waiting, setWaiting] = useState(false);
  const [preview, setPreview] = useState<'guide'|'essay'>('guide');
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);

  useEffect(() => {
    if (waiting && !running) {
      stageSetRef.current = [
        { text: '고객님의 정보를 안전하게 접수했습니다.', duration: 2000 + Math.random() * 1000 },
        { text: '입력하신 내용을 분석 중입니다.', duration: 10000 + Math.random() * 5000 },
        { text: `${company} 합격 자기소개서 데이터를 참고하고 있습니다.`, duration: 10000 + Math.random() * 5000 },
        { text: '고객님 맞춤형 자기소개서 가이드를 작성하고 있습니다.', duration: 13000 + Math.random() * 5000 },
        { text: '최종 결과물을 준비 중입니다. 곧 확인하실 수 있습니다.', duration: 15000 + Math.random() * 5000 }
      ];
      setRunning(true);
      setStageIndex(0);
    }
  }, [waiting, running, company]);

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

  if (!template) {
    return <div className="p-8 text-center text-xl">해당 회사/직무에 대한 질문 템플릿이 없습니다.</div>;
  }

  return (
    <AuthCheck>
      <div className='relative min-h-screen'>
        <div className={genStyles.grid} >
          <div className={genStyles.leftSide} >
            <h1 className='font-extrabold text-xl pb-4 text-dark text-[1.6rem]'>
              {company} {job} AI 자기소개서 생성
            </h1>
            <div className="text-lg font-bold text-gray-700">
              문항 별로 작성 후 하단 &apos;나만의 자기소개서/가이드 작성하기&apos; 클릭 부탁드립니다.
            </div>
            <div className="flex gap-[0.5rem] items-center justify-start text-gray-500 pb-[0.5rem] ">
              <div className="text-xl">※</div>
              <div className="text-center">개인의 경험을 최대한 자세하게 작성해 주세요.</div>
            </div>
            <div className='flex gap-12 my-6 border-b border-gray-300'>
              {sectionKeys.map((section) => (
                <div
                  key={section}
                  className={`${genStyles.tab} ${activeTab === section ? genStyles.active : ''}`}
                  onClick={() => {
                    setGuide(null);
                    setActiveTab(section);
                    setEssay(null);
                  }}
                >
                  {parseInt(section.replace('q', ''))}번 문항
                </div>
              ))}
            </div>
            {/* Show the question text for the active tab */}
            {activeTab && (
              <div className="mb-4 text-lg font-semibold">
                {(template as any)[`question${activeTab.replace('q', '')}`]}
              </div>
            )}
            {activeTab && (
              <DynamicQuestionSection
                key={activeTab}
                company={company}
                job={job}
                section={activeTab}
                questionId={parseInt(activeTab.replace('q', ''))}
                setGuide={setGuide}
                setEssay={setEssay}
                waiting={waiting}
                setWaiting={setWaiting}
              />
            )}
          </div>
          <div className={genStyles.rightSide} id="top">
              <div >
                <div className={`${genStyles.question} text-center`}>
                  드림패스 AI가 생성한 가이드/자기소개서
                </div>            
                <div className='flex w-full mx-auto bg-gray-300 p-[0.2rem] rounded-t-[0.5rem] border border-gray-500'>
                  <div 
                    className={`${genStyles.resultTab} ${running || !guide && genStyles.tabDisabled} ${!running && guide && preview === 'guide' ? genStyles.active : ''}`}
                    onClick={() => { if (guide) setPreview("guide"); }}
                  >
                    가이드
                  </div>
                  {!guide && <div className="my-auto w-[2px] h-full bg-gray-500 overflow-hidden">.</div>}
                  <div 
                    className={`${genStyles.resultTab} ${running || !guide && genStyles.tabDisabled} ${!running && guide && preview === 'essay' ? genStyles.active : ''}`}
                    onClick={() => { if (guide) setPreview("essay"); }}
                  >
                    자기소개서
                  </div>
                </div>
                {running ? (
                  <div className={genStyles.guideCtn}>
                    <div className='w-full pt-[2rem] text-center'>{stageSetRef.current?.[stageIndex].text}</div>
                    <div className='w-full pt-8'><DotSpinner /></div>
                  </div>
                ) : (
                  guide ? 
                    <>
                      {preview === "guide" ? (
                        <div className={genStyles.guideCtn}><GuideResult {...guide} /></div>
                      ) : (
                        <div className={genStyles.guideCtn}>
                          {essay && (
                            <>
                              <div>{essay?.essay.split('\n').map((line: any, i: any) => (
                                <div key={i}>
                                  {line}
                                  <br />
                                </div>
                              ))}</div>
                              <div className='w-[fit-content] mt-4 ml-auto text-gray-400'>{essay?.length}자</div>
                              </>
                          )
                          }
                        </div>
                      )}
                    
                    </>
                    : <textarea
                        value=""
                        placeholder="여기에 AI가 작성한 가이드가 표시됩니다."
                        disabled
                        className={genStyles.guideCtn}
                      />
                )}
              </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}

