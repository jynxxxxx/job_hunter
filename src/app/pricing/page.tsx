'use client'

import AuthCheck from '@/components/AuthCheck';
import Image from 'next/image';
import React, { useState } from 'react';

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState<{ tier:string; spotsLeft: number; price: number } | null>(null);

  const handlePurchaseClick = (pkg: { tier:string; spotsLeft: number; price: number }) => {
    setSelectedPackage(pkg);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">월간 구독</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              바로지원 AI 자기소개서 작성 서비스를 무제한으로 이용하세요.
              <br />
              <span className="font-semibold text-blue-700">월 60,000원</span> 정가 — 지금은 얼리버드 특별가로 제공 중입니다.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { tier: "1차 얼리버드", price: 10000, spotsLeft: 0 },
              { tier: "2차 얼리버드", price: 20000, spotsLeft: 4 },
              { tier: "3차 얼리버드", price: 30000, spotsLeft: 10 },
            ].map((pkg, i) => (
              <div
                key={i}
                className={`bg-white border-2 ${
                  pkg.spotsLeft === 0 ? 'border-gray-300 text-gray-400' : 'border-blue-200 hover:border-blue-400'
                } rounded-lg p-6 flex flex-col items-center text-center shadow-md transition-all duration-300 ${
                  pkg.spotsLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                <h2 className="text-2xl font-bold mb-1">{pkg.tier}</h2>
                <p className="text-3xl font-extrabold text-blue-700 mb-4">
                  {pkg.price.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-600 mb-6">
                   선착순: {10-pkg.spotsLeft}명/{10}명
                </p>
                <button
                  onClick={() => pkg.spotsLeft > 0 && handlePurchaseClick(pkg)}
                  className={`mt-auto w-full ${
                    pkg.spotsLeft === 0
                      ? 'bg-gray-300 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                  } py-3 rounded-lg font-semibold text-lg transition-colors`}
                  disabled={pkg.spotsLeft === 0}
                >
                  {pkg.spotsLeft === 0 ? '마감됨' : '구독하기'}
                </button>
              </div>
            ))}
          </div>

          <div className='border-t border-gray-300 pt-16 flex flex-col justify-center items-center'>
            <h2 className="text-4xl text-center text-gray-900 font-extrabold">컨설팅 서비스</h2>
            <h3 className="bg-primary text-white rounded-3xl py-2 px-8 text-xl mt-4 font-extrabold mb-4"><span className="line-through">200,000원</span> → 50,000원</h3>
            <div className="text-sm text-center">단, 선착순 10명에게 한달 제공, 주1회 설문조사 및 후기 제공 필요</div>
            <div className="text-sm text-center">1달 이내 서류 합격 못할 시 100% 전액 환불, 1주 이내 불만족시 100% 전액 환불</div>
            <div className="text-xs">*단, 컨설턴트와 최소 2회 미팅(및 첨삭) 및 3곳 이상 지원시</div>
            <div className={`pt-8 pb-16 text-gray-900  items-center sm:gap-8 2xl:gap-16`}>
              <div className="space-y-6 mb-6">
                <div>
                  <p className="font-semibold text-gray-800 mb-2  text-left">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">1단계</span>
                    아래 계좌로 위 금액을 송금해주세요.
                  </p>
                  <div className="flex justify-around items-center bg-gray-100 p-4 rounded-md text-center">
                    <div>
                      <p className="text-sm text-gray-700">카카오뱅크</p>
                      <p className="font-extrabold text-xl text-gray-900 mb-1">3333058317631</p>
                      <p className="text-sm text-gray-700">예금주: 박근철</p>
                    </div>
                    <div className='flex justify-center'>
                      <div className="w-32 h-32 relative border border-gray-200 rounded-md p-2">
                        <Image
                          src="/qr.png"
                          alt="QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2 text-left mt-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">2단계</span>
                    송금 후, 아래 정보와 함께&nbsp;<br className="sm:hidden" />010-8961-1918로 보내주세요.
                  </p>
                  <div className="bg-gray-100 p-2 rounded-md text-center">
                    <p className="font-bold text-gray-900 mb-1">
                      [입금자명] / [귀하의 서비스 로그인 이메일] /&nbsp;<br className="sm:hidden" />[가능한 1차 상담 날짜, 시간] 
                    </p>
                  </div>
                </div>
        
                <p className="text-center text-blue-700 font-semibold pt-6 sm:pt-12">
                  결제 완료 후, 1시간 이내로 1차 상담 안내 이메일이 발송됩니다.
                </p>
              </div>
            </div>   
          </div>

          <div className="text-center text-gray-500 text-sm mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold mb-2">구독 안내:</p>
            <ul className="w-fit mx-auto text-start list-disc list-inside space-y-1">
              <li>구독 기간 동안 모든 공고에 대해 무제한 자기소개서 생성 및 수정이 가능합니다.</li>
              <li>현재는 선착순 얼리버드 구간으로, 정가 전까지 단계별로 가격이 상승합니다.</li>
              <li>정가는 월 60,000원이며, 구독은 언제든지 취소할 수 있습니다.</li>
              <li>결제 관련 문의는 고객센터(teambarojiwon@gmail.com)로 연락 바랍니다.</li>
            </ul>
          </div>
        </div>

        {/* Manual Payment Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-8 mt-20 md:mt-16 lg:mt-8 w-[90vw] md:w-[70vw] lg:w-[50vw] overflow-y-auto max-h-[80vh] md:max-h-[75vh] lg:max-h-[80vh]">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                구독 가입 안내
              </h2>
              <p className="text-center text-lg text-gray-700 mb-4
              ">
                총 결제 금액: <span className="font-extrabold text-blue-600">{selectedPackage.price.toLocaleString()}원</span>
              </p>

              <div className="space-y-2 mb-6">
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">1단계</span>
                    아래 계좌로 위 금액을 송금해주세요.
                  </p>
                  <div className="flex justify-around items-center bg-gray-100 p-4 rounded-md text-center">
                    <div>
                      <p className="text-sm text-gray-700">카카오뱅크</p>
                      <p className="font-extrabold text-xl text-gray-900 mb-1">3333058317631</p>
                      <p className="text-sm text-gray-700">예금주: 박근철</p>
                    </div>
                    <div className='flex justify-center'>
                      <div className="w-32 h-32 relative border border-gray-200 rounded-md p-2">
                        <Image
                          src="/qr.png"
                          alt="QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">2단계</span>
                    송금 후, 아래 정보와 함께 010-8961-1918로 보내주세요.
                  </p>
                  <div className="bg-gray-100 p-2 rounded-md text-center">
                    <p className="font-bold text-gray-900 mb-1">
                      [입금자명] / [귀하의 서비스 로그인 이메일]
                    </p>
                  </div>
                </div>
        
                <p className="text-center text-sm text-blue-700 font-semibold mt-6">
                  결제 완료 확인 후 <span className="text-base">30분 내</span> 구독이 활성화됩니다.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg
                          hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}