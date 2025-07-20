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
    <div className='bg-extraDark flex w-full justify-center'>
      <section className={`${heroStyles.ctn} grid grid-rows-2 sm:grid-rows-[1fr] sm:grid-cols-[1.2fr_1fr] w-fit`}>
        <div className='flex flex-col justify-center'>
          <div className={heroStyles.title}>
            나를 담은 이야기로,<br/>회사 맞춤형 자소서를 완성하세요.
          </div>
          <div className={heroStyles.subtext}>
            치열해진 서류경쟁, AI Copilot 기술과&nbsp;<br className="sm:hidden" />3000건의 합격 데이터로
            
            &nbsp;<br className="hidden xl:block" />채용담당자 눈에 띄는&nbsp;<br className="sm:hidden" />자기소개서를 완성하세요
          </div>
          <div className='grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 sm:w-fit gap-2 sm:gap-4 mt-10 px-12 sm:px-0 mb-8 sm:mb-0'>
            <button
              className={`${heroStyles.herobtn} bg-bright/80 text-white w-full`}
              onClick={handleStart}
            >
              작성하기
            </button>
            <button
              className={`${heroStyles.herobtn} bg-gray-200 w-full`}
              onClick={handleFeedback}
            >
              피드백받기
            </button>
          </div>
        </div>
        <div className="relative w-full h-full sm:w-full pb-6">
          <Image
            src="/hero.png"
            alt="resume"
            fill
            className="object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
