"use client"

import { useEffect, useRef } from "react";
import heroStyles from "@/styles/hero.module.scss";

const HeroSection = () => {
  const scrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    scrollRef.current = () => {
      const target = document.getElementById('signup-forms');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }, []);

  return (
    <>
      <section className={heroStyles.ctn}>
        <div className={heroStyles.title}>
          채용 스트레스, 
          <br />바로지원으로 한 번에 해결하세요.
        </div>
        <p className={heroStyles.subtext}>
          취업 준비생부터 경력 구직자까지, 모두를 위한 맞춤형 AI 도우미.
        </p>

        <button
          className={heroStyles.herobtn}
          onClick={() => scrollRef.current?.()}
        >
          시작하기 →
        </button>
      </section>
    </>
  );
};

export default HeroSection;
