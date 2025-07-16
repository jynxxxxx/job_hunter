"use client"

import { useRouter } from 'next/navigation';
import heroStyles from "@/styles/hero.module.scss";
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const router = useRouter();
  const { authUser } = useAuth()

  const handleStart = () => {
    if (authUser) {
      router.push('/generate');
    } else {
      router.push('/login');
    }
  };

    const handleFeedback = () => {
    if (authUser) {
      router.push('/revision');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <section className={heroStyles.ctn}>
        <div className={heroStyles.title}>
          자소서, 쓰는 게 아니라<br/>&apos;합격&apos; 시키는 겁니다.
        </div>
        <div className={heroStyles.subtext}>
          3,000건 이상의 합격 자소서를 <div className="h-px sm:hidden"><br/></div>학습한 고도화된 AI가
          <br/>
          회사별·직무별 포인트를 정확히 짚어<div className="h-px sm:hidden"><br/></div>진짜 ‘붙을 자소서’를 만들어 드립니다.
        </div>
        <div className='flex gap-4 mt-10'>
          <button
            className={heroStyles.herobtn}
            onClick={handleFeedback}
          >
            무료 피드백 받기 →
          </button>
          <button
            className={heroStyles.herobtn}
            onClick={handleStart}
          >
            가입하고 생성하기 →
          </button>
        </div>
        
      </section>
    </>
  );
};

export default HeroSection;
