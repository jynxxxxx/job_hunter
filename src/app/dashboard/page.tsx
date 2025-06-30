'use client';

import HistoryPage from "@/components/tabs/HistoryPage";
import { useUserData } from "@/context/UserDataContext";

export default function Dashboard() {
  const { activePage } = useUserData()
  return (
    <>
      {activePage === 'generation' && 
        <div 
          style={{  textShadow: '1px 2px 6px rgba(255, 255, 255, 0.9)' }}
          className='bg-gradient-to-r from-primary to-[#f5f6f9] font-extrabold text-xl pb-4 text-center text text-[1.6rem] min-h-[70vh] pt-[8rem]'
        >
          <strong>서비스 개선 작업 중입니다.</strong><br />
          더 나은 모습으로 찾아뵙기 위해 잠시 서비스를 중단합니다.<br />
          <br />
          &apos;내 자기소개서 보기&apos; 탭에서 이전 기록을 계속 확인하실 수 있습니다. <br />
          <br />
          최대한 빠르게 돌아오겠습니다. 감사합니다.
        </div>
      }
      {activePage === 'history' && <HistoryPage />}
    </>
  )
}