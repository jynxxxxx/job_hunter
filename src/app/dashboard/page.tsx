'use client';

import { useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import Hyundai_Q1 from '@/components/Hyundai_Q1';
import Hyundai_Q2 from '@/components/Hyundai_Q2';
import Hyundai_Q3 from '@/components/Hyundai_Q3';
import hdStyles from "@/styles/hyundai.module.scss";
import HyundaiResult from '@/components/HyundaiResults';

interface HyundaiOutputProps {
  result: {
    core_keywords: string[];
    key_experiences: string[];
    applicant_character: string;
    outline: string[];
    review_from_interviewer: string[];
  };
}

export default function Dashboard() {
  const { userData } = useUserData()
  const [activeTab, setActiveTab] = useState('Q1');
  const [answer, setAnswer] = useState<HyundaiOutputProps | null>(null);
  const [waiting, setWaiting]= useState(false)
  
  return (
    <AuthCheck>
      <div className='p-[0.5rem] pt-[6rem] sm:p-[2rem] sm:pt-[6rem] bg-gradient-to-r from-primary to-[#f5f6f9] relative'>
        <h1 
          style={{  textShadow: '1px 2px 6px rgba(255, 255, 255, 0.9)' }}
          className='font-extrabold text-xl pb-4 text-center text-bright text-[1.6rem]'
        >
          {userData?.name ?  `${userData.name}님의` : ""} 드림패스 AI와 함께 자신만의 자기소개서를 완성해 보세요
        </h1>
        <div className='text-gray-500 text-center mb-[2rem]'>현대자동차 합격 자소서 500개 분석을 기반으로, 본인의 경험과 이력을 가장 잘 살릴 수 있는 방안을 제시해 드립니다.</div>
        <div className='flex w-[95%] mx-auto bg-gray-300 p-[0.2rem] rounded-[0.5rem] mb-8'>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q1' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer(null)
              setActiveTab('Q1')
            }}
          >
            1번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q2' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer(null)
              setActiveTab('Q2')
            }}
          >
            2번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q3' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer(null)
              setActiveTab('Q3')
            }}
          >
            3번 문항
          </div>
        </div>
        { activeTab === 'Q1' && 
          <h1 className={hdStyles.title}>내가 ‘모빌리티 기술 인력’이라고 생각하는 이유 + 나만의 강점</h1> 
        }
        { activeTab === 'Q2' && 
          <h1 className={hdStyles.title}>협업 속 문제 해결 경험 + 내 단점과 극복 노력</h1> 
        }
        { activeTab === 'Q3' && 
          <h1 className={hdStyles.title}>목표 설정 → 어려움 → 극복 과정</h1> 
        }
        <div className={hdStyles.grid}>
          <div>
            { activeTab === 'Q1' && <Hyundai_Q1 setAnswer={setAnswer} waiting={waiting} setWaiting={setWaiting}/> }
            { activeTab === 'Q2' && <Hyundai_Q2 setAnswer={setAnswer} waiting={waiting} setWaiting={setWaiting}/> }
            { activeTab === 'Q3' && <Hyundai_Q3 setAnswer={setAnswer} waiting={waiting} setWaiting={setWaiting}/> }
          </div>
          <div className={hdStyles.rightSide}>
            <div >
              <div id="top" className={`${hdStyles.question} text-center`}>
                드림패스 AI가 생성한 가이드
              </div>
              {waiting ? (
                <div className={hdStyles.answerCtn}>
                  가이드 생성중<span className={hdStyles.animatedDots}></span>
                  <br />
                  잠시만 기다려주세요
                </div>
              ) : (
                answer
                  ? <div className={hdStyles.answerCtn}><HyundaiResult {...answer} /></div>
                  : <textarea
                      value=""
                      placeholder="여기에 AI가 작성한 가이드가 표시됩니다."
                      rows={10}
                      disabled
                      className={hdStyles.answerCtn}
                    />
              )}
            </div>
            {answer && (
              <div className='w-[105%] ml-[-1rem] bg-[#F9F9FB] rounded-xl py-4 pl-4 mb-[2rem]'>
                <div className='font-extrabold text-center pb-4 text-xl'>직접 작성하기 어려우신가요?</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col justify-center gap-4'>
                    <p>
                      <strong>현대차 · 인사팀 출신 전문가들이 직접!</strong><br />
                      전문가가 여러분의 자소서를 기반으로 1번 문항 뿐만 아니라, 2번/3번 문항까지 전문가의 언어로 작성을 도와드립니다.<br />
                      지금 신청 시 선착순 10명 1만원 (현재 7/10명 신청 중) + 만족 못할 시 100% 환불 보장!<br />
                      ※ 일반가 3만원
                    </p>

                    <p>
                     <strong>서비스 신청 방안</strong><br />
                     <div className='flex flex-col'>
                        <div>① 하단 계좌번호 또는 카카오페이로 입금합니다. 입금 후, 010-6642-9318로 입금자명/이메일 주소를 보내주세요</div>
                        <div>② 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 2/3번 문항 작성을 위한 설문조사를 진행 요청 드립니다.</div>
                        <div>③ 설문조사 완료 시, 바로지원 팀에서 바로 자기소개서 작성 작업을 진행합니다.</div>
                        <div>④ 가입하신 이메일로 최대 8시간 내로 완성된 결과물을 제공해 드립니다. (최대 2회 리뷰 가능).</div>
                      </div>
                    </p>
                    <div className='flex items-center justify-center gap-4 mr-4'>
                    <img
                      src="/qr.png"
                      alt="Donate via QR Code"
                      className='w-[8rem]'
                    />
                    <div>
                      <p className='text-sm text-center text-black'>카카오뱅크</p>
                      <p className='font-extrabold text-center text-black'>3333016420692</p>
                      <p className='text-center text-black'>문인욱 </p>
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
                <div className='font-extrabold text-center pb-4 text-xl'>자소서가 도움이 되었나요?</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <p>
                      <strong>현대차 · 인사팀 출신 전문가들이 직접!</strong><br />
                      전문가가 여러분의 자소서를 기반으로 1번 문항 뿐만 아니라, 2번/3번 문항까지 전문가의 언어로 작성을 도와드립니다.<br />
                      지금 신청 시 선착순 10명 1만원 (현재 7/10명 신청 중) + 만족 못할 시 100% 환불 보장!<br />
                      ※ 일반가 3만원
                    </p>
                    <p>
                     <strong>서비스 신청 방안</strong><br />
                     <div className='flex flex-col items-start'>
                        <div>① 하단 계좌번호 또는 카카오페이로 입금합니다. 입금 후, 010-6642-9318로 입금자명/이메일 주소를 보내주세요</div>
                        <div>② 바로지원 팀에서 입금 결과를 확인 후, 30분 내로 2/3번 문항 작성을 위한 설문조사를 진행 요청 드립니다.</div>
                        <div>③ 설문조사 완료 시, 바로지원 팀에서 바로 자기소개서 작성 작업을 진행합니다.</div>
                        <div>④ 가입하신 이메일로 최대 8시간 내로 완성된 결과물을 제공해 드립니다. (최대 2회 리뷰 가능).</div>
                      </div>
                      
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-2 mr-4'>
                        <img
                          src="/qr.png"
                          alt="Donate via QR Code"
                          className='w-[13rem]'
                        />
                        <div>
                          <div className='text-sm text-center text-black'>카카오뱅크</div>
                          <div className='font-extrabold text-center text-black'>3333016420692</div>
                          <div className='text-center text-black'>문인욱 </div>
                        </div>
                      </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthCheck>
  )
}

