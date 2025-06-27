"use client"

import { useRouter } from 'next/navigation';
import heroStyles from "@/styles/hero.module.scss";

const HeroSection = () => {
  const router = useRouter();

  return (
    <>
      <section className={heroStyles.ctn}>
        <div className={heroStyles.title}>
          취업 준비 스트레스, 
          <br />바로지원으로 한 번에 해결하세요.
        </div>
        <p className={heroStyles.subtext}>
          취업 준비생부터 경력 구직자까지, 모두를 위한 맞춤형 AI 도우미.
        </p>

        <button
          className={heroStyles.herobtn}
          onClick={() => router.push('/login')}
        >
          시작하기 →
        </button>
      </section>
    </>
  );
};

export default HeroSection;
