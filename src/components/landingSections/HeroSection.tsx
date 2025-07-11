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
          바로지원과 함께 <br />나만의 자기소개서를 
          <div className="h-px sm:hidden"><br/></div>
          완성하세요
        </div>
        <div className={heroStyles.subtext}>
          1000건의 합격자소서로 학습된 
          <div className="h-px sm:hidden"><br/></div>
          AI 기술로 만드는 나를 담은 자기소개서
        </div>
        <button
          className={heroStyles.herobtn}
          onClick={handleStart}
        >
          AI 자기소개서 생성하기→
        </button>
      </section>
      {/* <div className={heroStyles.btnctn}> */}

        {/* </div> */}
    </>
  );
};

export default HeroSection;
