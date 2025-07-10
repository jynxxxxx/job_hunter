"use client"

import { useRouter } from 'next/navigation';
import heroStyles from "@/styles/hero.module.scss";
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const router = useRouter();
  const { authUser } = useAuth()

  const handleStart = () => {
    if (authUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <section className={heroStyles.ctn}>
        <div className={heroStyles.title}>
          취업 준비는 전략이다.
        </div>
        <p className={heroStyles.subtext}>
          인사 전문가와 AI 연구원이 설계한 맞춤형 자소서로 경쟁력을 높이세요.
        </p>
        <p className={heroStyles.subtext}>
          지원 공고별 맞춤 자소서 생성과 작성 가이드, 면접관 관점의 코멘트까지!
        </p>
      </section>
      <div className={heroStyles.btnctn}>
        <button
          className={heroStyles.herobtn}
          onClick={handleStart}
        >
          AI 자기소개서 생성하기→
        </button>
        </div>
    </>
  );
};

export default HeroSection;
