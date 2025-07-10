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
          바로지원과 함께 <br />나만의 자기소개서를 완성해요
        </div>
        <p className={heroStyles.subtext}>
          1000건의 합격자소서로 학습된 AI 기술로 만드는 나를 담은 자기소개서
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
