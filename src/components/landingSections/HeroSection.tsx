"use client"

import { useRouter } from 'next/navigation';
import heroStyles from "@/styles/hero.module.scss";
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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
      <section className={`${heroStyles.ctn} grid grid-rows-[1.7fr_1fr] sm:grid-cols-[1.5fr_1fr]`}>
        <div className='flex flex-col justify-center'>
          <div className={heroStyles.title}>
            자소서, 쓰는 게 아니라,<br/>&apos;합격&apos; 시키는 겁니다.
          </div>
          <div className={heroStyles.subtext}>
            AI Copilot 기술과 3000건의 합격 자기소개서로,
            &nbsp;<div className="h-px sm:hidden"></div>
            3분이면 합격률이 높은 자소서가 완성됩니다
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-10 px-12 sm:px-0 mb-8 sm:mb-0'>
            <button
              className={`${heroStyles.herobtn} bg-bright/80 text-white`}
              onClick={handleStart}
            >
              자기소개서 작성하기 →
            </button>
            <button
              className={`${heroStyles.herobtn} bg-gray-200`}
              onClick={handleFeedback}
            >
              자기소개서 피드백받기 →
            </button>
          </div>
        </div>
        <div className="relative w-full h-full p-6 ">
          <Image
            src="/hero.png"
            alt="resume"
            fill
            className="px-2 object-contain"
          />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
