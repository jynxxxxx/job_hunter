"use client"

import HeroSection from '../components/landingSections/HeroSection';
import Testimonials from '../components/landingSections/Testimonials';
import { useAuth } from '@/context/AuthContext';
import Instructions from '@/components/landingSections/Instructions';
import Features from '@/components/landingSections/Features';
import Image from 'next/image';

export default function Home() {
  const { setJustSignedOut } = useAuth();
  setJustSignedOut(false); // reset flag if redirected from logout

  return (
    <>
      <HeroSection />
      <Instructions />
      <Features />
      {/* <JobCarousel /> */}
      <Testimonials />
      <div className="h-fit bg-primary/5 px-6 py-16 text-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          {/* <h1 className="text-2xl sm:text-3xl font-bold mb-4">자기소개서, 합격 가능성을 높이는 3가지 방법!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            바로지원에서는 3가지 방식으로 자소서를 빠르게 해결할 수 있어요.
          </p>

          <div className="grid gap-6 sm:grid-cols-3 text-left">
            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">🔥 인기 채용 공고 자소서 작성</h2>
              <p className="text-sm text-gray-600 mb-4">
                인기 대기업 채용 공고 리스트에서 클릭만 하면 빠르고 정교한 나만의 자소서 완성
              </p>
              <button
                onClick={() => router.push("/generate")}
                className="text-blue-600 font-semibold hover:underline"
              >
                공고 보러가기 →
              </button>
            </div>

            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">✍️ 그 외 자소서 작성</h2>
              <p className="text-sm text-gray-600 mb-4">
                지원하는 기업, 직무, 자소서 문항을 입력하면, 개인별 최적화된 자소서 완성
              </p>
              <button
                onClick={() => router.push("/generate/open")}
                className="text-blue-600 font-semibold hover:underline"
              >
                자유 생성하기 →
              </button>
            </div>

            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">🛠 내 자소서 첨삭</h2>
              <p className="text-sm text-gray-600 mb-4">
                내가 쓴 자소서는 지원하는 공고에 최적화 되어 있는지 피드백과 함께 첨삭
              </p>
              <button
                onClick={() => router.push("/revision")}
                className="text-blue-600 font-semibold hover:underline"
              >
                첨삭하러가기 →
              </button>
            </div>
          </div> */}

          <p className="text-gray-700 font-bold text-sm mb-4">
            Built by
          </p>
          <div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto justify-center'>
            <div className='flex flex-col items-center justify-center w-fit gap-2 mx-auto'>
              <div className="relative w-[5rem] h-[5rem] pb-6 border border-gray-200 rounded shadow-lg">
                <Image
                  src="/kaist.png"
                  alt="resume"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className='flex flex-col items-center justify-center w-fit gap-2 mx-auto'>
              <div className="relative w-[5rem] h-[5rem] pb-6 border border-gray-200 rounded shadow-lg">
                <Image
                  src="/antler.png"
                  alt="resume"
                  fill
                  className="object-contain rounded px-2"
                />
              </div>
            </div>
            <div className='flex flex-col items-center justify-center w-fit gap-2 mx-auto'>
              <div className="relative w-[5rem] h-[5rem] pb-6 border border-gray-200 rounded shadow-lg bg-[#2875AF]">
                <Image
                  src="/ucla.png"
                  alt="resume"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
