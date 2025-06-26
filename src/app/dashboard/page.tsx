'use client';

import { useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import AuthCheck from '@/components/AuthCheck';
import Hyundai_Q1 from '@/components/Hyundai_Q1';
import Hyundai_Q2 from '@/components/Hyundai_Q2';
import Hyundai_Q3 from '@/components/Hyundai_Q3';
import hdStyles from "@/styles/hyundai.module.scss";

export default function Dashboard() {
  const { userData } = useUserData()
  const [activeTab, setActiveTab] = useState('Q1');
  const [answer, setAnswer] = useState<string>('');
  const [waiting, setWaiting]= useState(false)

  return (
    <AuthCheck>
      <div className='p-[0.5rem] pt-[6rem] sm:p-[2rem] sm:pt-[6rem] bg-gradient-to-r from-primary to-[#f5f6f9]'>
        <h1 
          style={{  textShadow: '1px 2px 6px rgba(255, 255, 255, 0.9)' }}
          className='font-extrabold text-xl pb-8 text-center text-bright text-[1.6rem]'
        >
          {userData?.name ?  `${userData.name}의` : ""} 현대자동차 자소서 드림패스
        </h1>
        <div className='flex w-[95%] mx-auto bg-gray-300 p-[0.2rem] rounded-[0.5rem] mb-8 '>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q1' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer("")
              setActiveTab('Q1')
            }}
          >
            1번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q2' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer("")
              setActiveTab('Q2')
            }}
          >
            2번 문항
          </div>
          <div 
            className={`${hdStyles.tab} ${activeTab === 'Q3' ? hdStyles.active : ''}`}
            onClick={() => {
              setAnswer("")
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
                드림패스 AI가 생성한 자소서
              </div>
              {waiting ? (
                <div className={hdStyles.answerCtn}>
                  자소서 생성중<span className={hdStyles.animatedDots}></span>
                  <br />
                  잠시만 기다려주세요
                </div>
              ) : (
                <textarea
                  value={answer}
                  placeholder="여기에 AI가 작성한 자소서가 표시됩니다."
                  rows={10}
                  disabled = {!answer || answer === ""}
                  className={hdStyles.answerCtn}
                  onChange={e => setAnswer(e.target.value)}
                />
              )}   
            </div>
            {answer && (
              <div className='w-[105%] ml-[-1rem] bg-[#F9F9FB] rounded-xl py-4 pl-4 mb-[2rem]'>
                <div className='font-extrabold text-center pb-4 text-xl'>자소서가 도움이 되었나요?</div>
                <div className='flex justify-around gap-6'>
                  <div className='flex flex-col items-center justify-center gap-4'>
                    <p>
                      조금 더 다듬고 싶으시다면, ₩30,000으로<br />
                      전문가가 여러분의 자소서를 기반으로 <strong>더 설득력 있고 완성도 높게</strong> 개선해드립니다.<br />
                      <strong>최대 3회까지 수정도</strong> 포함되어 있어요.
                    </p>

                    <p>
                      오른쪽 QR코드나 계좌번호로 입금해주시면,<br />
                      <strong>입금시 메모에 이메일 주소를 꼭 남겨주세요!</strong> 그래야 어떤 분이 보내주셨는지 확인하고 도와드릴 수 있습니다.
                      더 나은 결과물을 위해 정성껏 도와드릴게요. 감사합니다!
                    </p>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-4 mr-4'>
                    <img
                      src="/qr.png"
                      alt="Donate via QR Code"
                      className='w-[13rem]'
                    />
                    <div>
                      <p className='text-sm text-center text-black'>카카오뱅크</p>
                      <p className='font-extrabold text-center text-black'>3333016420692</p>
                      <p className='text-center text-black'>문인욱 </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}

