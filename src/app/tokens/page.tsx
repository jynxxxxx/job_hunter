'use client'

import React, { useState } from 'react';

export default function BuyTokensPage() {
  const [selectedPackage, setSelectedPackage] = useState<{ tokens: number; price: number } | null>(null);

  const tokenPackages = [
    { id: 1, tokens: 1, price: 20000, description: "채용 공고 1건 지원용" },
    { id: 2, tokens: 3, price: 40000, description: "채용 공고 3건 지원용", savings: "20,000원 절약!" },
    { id: 3, tokens: 5, price: 50000, description: "채용 공고 5건 지원용", savings: "50,000원 절약!" },
  ];

  const handlePurchaseClick = (pkg: { tokens: number; price: number }) => {
    setSelectedPackage(pkg);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">토큰 구매</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            바로지원 AI 자기소개서 작성 서비스 이용을 위한 토큰
            <br />
            **1 토큰으로 1개의 채용 공고에 대해 무제한으로 자기소개서를 생성하고 수정할 수 있습니다.**
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {tokenPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border-2 border-blue-200 rounded-lg p-6 flex flex-col items-center text-center shadow-md
                         hover:shadow-lg hover:border-blue-400 transition-all duration-300"
            >
              <h2 className="text-3xl font-bold text-blue-700 mb-2">{pkg.tokens}토큰</h2>
              <p className="text-2xl font-extrabold text-gray-800 mb-4">
                {pkg.price.toLocaleString()}원
              </p>
              {pkg.savings && (
                <p className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full mb-3">
                  {pkg.savings}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>
              <button
                onClick={() => handlePurchaseClick(pkg)}
                className="mt-auto w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                구매하기
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-semibold mb-2">토큰 사용 안내:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>1토큰은 1건의 채용 공고에 사용되며, 해당 건에 대해 무제한 생성 및 수정 가능합니다.</li>
            <li>구매한 토큰은 화면 우측 상단에서 확인 가능하며, 언제든지 사용하실 수 있습니다.</li>
            <li>결제 관련 문의는 고객센터(teambarojiwon@gmail.com)로 연락 바랍니다.</li>
          </ul>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 mt-20 md:mt-16 lg:mt-8 w-[90vw] md:w-[70vw] lg:w-[35vw] overflow-y-auto max-h-[80vh] md:max-h-[75vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {selectedPackage.tokens} 토큰 구매 안내
            </h2>
            <p className="text-center text-lg text-gray-700 mb-6">
              총 결제 금액: <span className="font-extrabold text-blue-600">{selectedPackage.price.toLocaleString()}원</span>
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <p className="font-semibold text-gray-800 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">1단계</span>
                  아래 계좌로 정확한 금액을 송금해주세요.
                </p>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-700">카카오뱅크</p>
                  <p className="font-extrabold text-xl text-gray-900 mb-1">3333058317631</p>
                  <p className="text-sm text-gray-700">예금주: 박근철</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">2단계</span>
                  송금 후, 아래 정보와 함께 카카오톡으로 알려주세요.
                </p>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-700">카카오톡 ID: [당신의 카카오톡 ID 또는 전화번호]</p> {/* IMPORTANT: Replace with your actual KakaoTalk ID or Phone number */}
                  <p className="font-bold text-gray-900 mb-1">
                    [송금자명] / [귀하의 서비스 로그인 이메일] / [구매 토큰 수: {selectedPackage.tokens}개]
                  </p>
                </div>
              </div>

              {/* Optional: Add QR code if you have a QR for Kakao Pay or bank transfer */}
              <div className='flex justify-center mt-6'>
                <img src="/qr.png" alt="QR Code" className='w-32 h-32 object-contain border border-gray-200 rounded-md p-2' />
              </div>

              <p className="text-center text-sm text-blue-700 font-semibold mt-6">
                확인 후 <span className="text-base">30분 이내</span>에 토큰이 계정에 추가됩니다.
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg
                         hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}