'use client';

import React from "react";
import { useRouter } from "next/navigation";
import AuthCheck from "@/components/AuthCheck";

export default function Dashboard() {
  const router = useRouter();
  return (
    <AuthCheck>
      <div className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">자기소개서, 합격 가능성을 높이는 3가지 방법!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            바로지원에서는 3가지 방식으로 자소서를 빠르게 해결할 수 있어요.
          </p>

          <div className="grid gap-6 sm:grid-cols-3 text-left">
            {/* Service 1 */}
            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">🔥 인기 채용 공고 자소서 작성</h2>
              <p className="text-sm text-gray-600 mb-4">
                인기 대기업 채용 공고 리스트에서 클릭만 하면 빠르고 정교한 나만의 자소서 완성
              </p>
              <button
                onClick={() => router.push("/generate/trending")}
                className="text-blue-600 font-semibold hover:underline"
              >
                공고 보러가기 →
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">✍️ 그 외 자소서 작성</h2>
              <p className="text-sm text-gray-600 mb-4">
                지원하는 기업, 직무, 자소서 문항을 입력하면, 개인별 최적화된 자소서 완성
              </p>
              <button
                onClick={() => router.push("/generate/free")}
                className="text-blue-600 font-semibold hover:underline"
              >
                자유 생성하기 →
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 transition">
              <h2 className="text-xl font-semibold mb-2">🛠 내 자소서 첨삭</h2>
              <p className="text-sm text-gray-600 mb-4">
                내가 쓴 자소서는 지원하는 공고에 최적화 되어 있는지 피드백과 함께 첨삭
              </p>
              <button
                onClick={() => router.push("/generate/revision")}
                className="text-blue-600 font-semibold hover:underline"
              >
                첨삭하러가기 →
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-12">
            원하는 기능이 보이지 않나요? <span className="underline cursor-pointer">teambarojiwon@gmail.com</span> 으로 이메일 요청 보내주세요
          </p>
        </div>
      </div>
    </AuthCheck>
  )
}