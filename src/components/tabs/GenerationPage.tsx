'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import Hyundai_Q1 from '@/components/hyundaiSections/Hyundai_Q1';
import Hyundai_Q2 from '@/components/hyundaiSections/Hyundai_Q2';
import Hyundai_Q3 from '@/components/hyundaiSections/Hyundai_Q3';
import hdStyles from "@/styles/hyundai.module.scss";
import HyundaiGuideResult from '@/components/hyundaiSections/HyundaiGuideResults';
import { HyundaiEssayOutputProps, HyundaiGuideOutputProps } from '@/types/forms';
import { DotSpinner } from '../layoutSections/DotSpinner';

export default function GenerationPage() {
  const { userData } = useUserData()
  const [activeTab, setActiveTab] = useState('Q1');
  const [guide, setGuide] = useState<HyundaiGuideOutputProps | null>(null);
  const [essay, setEssay] = useState<HyundaiEssayOutputProps | null>(null);
  const [waiting, setWaiting]= useState(false)
  const [preview, setPreview] = useState<"guide"|"essay">("guide")
  const [stageIndex, setStageIndex] = useState(0);
  const [running, setRunning] = useState(false)
  const stageSetRef = useRef<{ text: string; duration: number }[] | null>(null);

  useEffect(() => {
    if (waiting && !running) {
    stageSetRef.current = [
      { text: "고객님의 정보를 안전하게 접수했습니다.", duration: 2000 + Math.random() * 1000 },
      { text: "입력하신 내용을 분석 중입니다.", duration: 10000 + Math.random() * 5000 },
      { text: "현대자동차 합격 자기소개서 데이터를 참고하고 있습니다.", duration: 10000 + Math.random() * 5000 },
      { text: "고객님 맞춤형 자기소개서 가이드를 작성하고 있습니다.", duration: 13000 + Math.random() * 5000 },
      { text: "최종 결과물을 준비 중입니다. 곧 확인하실 수 있습니다.", duration: 15000 + Math.random() * 5000 }
    ];

      setRunning(true);
      setStageIndex(0);
    }
  }, [waiting, running]);

  useEffect(() => {
    if (!running || !stageSetRef.current) return;

    const stages = stageSetRef.current;

    if (stageIndex >= stages.length - 1) {
      setPreview("guide")
      setRunning(false); // cycle finished
      return;
    }

    const timer = setTimeout(() => {
      setStageIndex(stageIndex + 1);
    }, stages[stageIndex].duration);

    return () => clearTimeout(timer);
  }, [running, stageIndex]);
  
  return (
    <AuthCheck>
      <div className='p-[0.5rem] pt-[6rem] sm:p-[2rem] sm:pt-[6rem] bg-gradient-to-r from-primary to-[#f5f6f9] relative'>
        <h1 
          style={{  textShadow: '1px 2px 6px rgba(255, 255, 255, 0.9)' }}
          className='font-extrabold text-xl pb-4 text-center text-bright text-[1.6rem] min-h-[60vh] pt-16'
        >
          <strong>서비스 개선 작업 중입니다.</strong><br />
          더 나은 모습으로 찾아뵙기 위해 잠시 서비스를 중단합니다.<br />
          <br />
          &apos;내 자기소개서 보기&apos; 탭에서 이전 기록을 계속 확인하실 수 있습니다. <br />
          <br />
          최대한 빠르게 돌아오겠습니다. 감사합니다.
          {/* {userData?.name ?  `${userData.name}님의` : ""} 드림패스 AI와 함께 자신만의 자기소개서를 완성해 보세요 */}
        </h1>
        {/* <div className='text-gray-500 text-center mb-[2rem]'>현대자동차 합격 자기소개서 500개 분석을 기반으로, 본인의 경험과 이력을 가장 잘 살릴 수 있는 방안을 제시해 드립니다.</div>
        <div className='flex w-[95%] mx-auto bg-gray-300 p-[0.2rem] rounded-[0.5rem] mb-8'>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q1' ? hdStyles.active : ''}`}
            onClick={() => {
              setGuide(null)
              setActiveTab('Q1')
            }}
          >
            1번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q2' ? hdStyles.active : ''}`}
            onClick={() => {
              setGuide(null)
              setActiveTab('Q2')
            }}
          >
            2번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q3' ? hdStyles.active : ''}`}
            onClick={() => {
              setGuide(null)
              setActiveTab('Q3')
            }}
          >
            3번 문항
          </div>
        </div>
        { activeTab === 'Q1' && 
          <h1 className={hdStyles.title}>
            <div>①</div>
            <div>
              자신이 &apos;모빌리티 기술인력&apos;이라고 생각하는 이유와 남들과 차별화된 본인만의 강점을 기술해 주십시오. <span className='font-normal text-[1rem] text-gray-500'>(800자 이내)</span>
            </div>
          </h1> 
        }
        { activeTab === 'Q2' && 
          <h1 className={hdStyles.title}>
            <div>②</div>
            <div>
              협업을 통해서 문제를 해결해본 경험과, 그 과정에서 느꼈던 본인 성격의 단점, 이를 극복하기 위한 노력을 말씀해주세요.  <span className='font-normal text-[1rem] text-gray-500'>(800자 이내)</span>
            </div> 
          </h1> 
        }
        { activeTab === 'Q3' && 
          <h1 className={hdStyles.title}>
            <div>③</div>
            <div>
              스스로 목표를 설정해서 달성해나가는 과정에서 겪은 어려움과 극복해낸 방법을 말씀해 주십시오. <span className='font-normal text-[1rem] text-gray-500'>(800자 이내)</span>
            </div>
          </h1> 
        }
        <div className={hdStyles.grid}>
          <div>
            { activeTab === 'Q1' && <Hyundai_Q1 setGuide={setGuide} setEssay={setEssay} waiting={waiting} setWaiting={setWaiting}/> }
            { activeTab === 'Q2' && <Hyundai_Q2 setGuide={setGuide} setEssay={setEssay} waiting={waiting} setWaiting={setWaiting}/> }
            { activeTab === 'Q3' && <Hyundai_Q3 setGuide={setGuide} setEssay={setEssay} waiting={waiting} setWaiting={setWaiting}/> }
          </div>
          <div className={hdStyles.rightSide} id="top">
            <div >
              <div className={`${hdStyles.question} text-center`}>
                드림패스 AI가 생성한 가이드/자기소개서
              </div>            
              <div className='flex w-full mx-auto bg-gray-300 p-[0.2rem] rounded-t-[0.5rem] border border-gray-500'>
                <div 
                  className={`${hdStyles.tab} ${running || !guide && hdStyles.tabDisabled} ${!running && guide && preview === 'guide' ? hdStyles.active : ''}`}
                  onClick={() => { if (guide) setPreview("guide"); }}
                >
                  가이드
                </div>
                {!guide && <div className="my-auto w-[2px] h-full bg-gray-500 overflow-hidden">.</div>}
                <div 
                  className={`${hdStyles.tab} ${running || !guide && hdStyles.tabDisabled} ${!running && guide && preview === 'essay' ? hdStyles.active : ''}`}
                  onClick={() => { if (guide) setPreview("essay"); }}
                >
                  자기소개서
                </div>
              </div>
              {running ? (
                <div className={hdStyles.guideCtn}>
                  <div className='w-full pt-[2rem] text-center'>{stageSetRef.current?.[stageIndex].text}</div>
                  <div className='w-full pt-8'><DotSpinner /></div>
                </div>
              ) : (
                guide ? 
                  <>
                    {preview === "guide" ? (
                      <div className={hdStyles.guideCtn}><HyundaiGuideResult {...guide} /></div>
                    ) : (
                      <div className={hdStyles.guideCtn}>
                        {essay && (
                          <>
                            <div>{essay?.essay.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
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
                      className={hdStyles.guideCtn}
                    />
              )}
            </div>
            {!running && guide && !userData?.hasPaid && (
              <div className='w-[105%] ml-[-1rem] bg-[#F9F9FB] rounded-xl py-4 pl-4 mb-[2rem]'>
                <div className='font-extrabold text-center pb-4 text-xl'>직접 작성하기 어려우신가요?</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col justify-center gap-4'>
                    <div>
                      <strong>현대차 · 인사팀 출신 전문가들이 직접!</strong><br />
                      500개의 합격자기소개서와 전문가의 협력으로 만든<br />
                      자체 개발 자기소개서 전용 AI가<br />
                      1번 문항 뿐만 아니라, 2/3번 문항까지 전문가의 언어로 작성을 도와드립니다.<br />
                      ※ 서류합격시 &apos;예상면접 질문&apos; 및 &apos;AI 모의면접&apos; 서비스 제공.
                      <div className='w-[fit-content]'>
                        <strong><span style={{ textDecoration: 'line-through'}} className='text-gray-500' >정가 30,000원</span> → 15,000원<br /></strong>
                      </div>
                    </div>

                    <div>
                     <strong>서비스 신청 방안</strong><br />
                     <div className='flex flex-col'>
                        <div>① 하단 계좌번호 또는 카카오페이로 입금합니다. 입금 후, 010-8961-1918로 입금자명/이메일 주소를 보내주세요</div>
                        <div>② 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 2/3번 문항을 활용할 수 있도록 작성 권한이 활성화됩니다.</div>
                      </div>
                    </div>
                    <div className='flex items-center justify-center gap-4 mr-4'>
                    <img
                      src="/qr.png"
                      alt="Donate via QR Code"
                      className='w-[8rem]'
                    />
                    <div>
                      <p className='text-sm text-center text-black'>카카오뱅크</p>
                      <p className='font-extrabold text-center text-black'>3333058317631</p>
                      <p className='text-center text-black'>박근철</p>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!userData?.hasPaid && (activeTab === 'Q2' ||activeTab === 'Q3') && (      
          <>
            <div className={hdStyles.paywallOverlay}></div>
            <div className={hdStyles.paywallMessage}>
              <h2>🔒 프리미엄 콘텐츠입니다</h2>
              <div className='w-full bg-[#F9F9FB] rounded-xl py-4 px-4 '>
                <div className='font-extrabold text-center pb-4 text-xl'>자기소개서가 도움이 되었나요?</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <div>
                      <strong>현대차 · 인사팀 출신 전문가들이 직접!</strong><br />
                      500개의 합격자기소개서와 전문가의 협력으로 만든<br />
                      자체 개발 자기소개서 전용 AI가<br />
                      1번 문항 뿐만 아니라, 2/3번 문항까지 전문가의 언어로 작성을 도와드립니다.<br />
                      ※ 서류합격시 &apos;예상면접 질문&apos; 및 &apos;AI 모의면접&apos; 서비스 제공.
                      <div className='text-left w-[fit-content] mx-auto'>
                        <strong><span style={{ textDecoration: 'line-through'}} className='text-gray-500' >정가 30,000원</span> → 15,000원<br /></strong>
                      </div>
                    </div>
                    <div>
                     <strong>서비스 신청 방안</strong><br />
                     <div className='flex flex-col items-start'>
                        <div>① 하단 계좌번호 또는 카카오페이로 입금합니다. 입금 후, 010-8961-1918로 입금자명/이메일 주소를 보내주세요.</div>
                        <div>② 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 2/3번 문항을 활용할 수 있도록 작성 권한이 활성화됩니다.</div>
                      </div>
                      
                    </div>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-2 mr-4'>
                        <img
                          src="/qr.png"
                          alt="Donate via QR Code"
                          className='w-[13rem]'
                        />
                        <div>
                          <div className='text-sm text-center text-black'>카카오뱅크</div>
                          <div className='font-extrabold text-center text-black'>3333058317631</div>
                          <div className='text-center text-black'>박근철</div>
                        </div>
                      </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </>
        )} */}
      </div>
    </AuthCheck>
  )
}

