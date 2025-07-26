'use client'

import React, { useRef, useState } from "react";
import { Star, Smile, Frown, Meh, PenTool } from "lucide-react";
import { EvaluateResponse } from "@/types/forms";
import { getFeedback, getPersonaFeedback } from "../api/generate";
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthCheck from "@/components/AuthCheck";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function FeedbackPage() {
  const { authUser } = useAuth()
  const [questionText, setQuestionText] = useState("");
  const [essayText, setEssayText] = useState("");
  const [feedbackStyle, setFeedbackStyle] = useState("럭키비키");
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [personaResult, setPersonaResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getScoreIcon = (score: number) => {
    if (score < 40) return <Frown className="text-red-400" />;
    if (score < 80) return <Meh className="text-yellow-400" />;
    return <Smile className="text-green-400 animate-bounce" />;
  };

  const handleEvaluate = async () => {
    if (!authUser) { return }
    setLoading(true);
    setResult(null);
    setPersonaResult(null);
    try {
      const input = {
        question_text: questionText,
        essay_text: essayText
      };
      const evalRes = await getFeedback(input);
      
      const personaRes = await getPersonaFeedback({
          ...input,
          feedback_dict: evalRes.feedback_dict,
          feedback_style_name: feedbackStyle
        });
        
      setResult(evalRes);
      setPersonaResult(personaRes.persona_feedback);

      setTimeout(() => {
        const element = resultRef.current;
        if (element) {
          const yOffset = -100; // adjust offset as needed
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);

      const userRef = doc(db, "users", authUser?.uid);

      await addDoc(collection(db, "users", authUser.uid, "feedback"), {
        createdAt: serverTimestamp(),
        ...input,
      });
  

      await updateDoc(userRef, {
        ['feedback_count']: increment(1),
      });
    } catch {
      toast.error("에러가 발생했어요! 다시 시도해주세요.");
    }
    setLoading(false);
  };

  return (
    <AuthCheck>
      <div className="my-8 select-none h-full">
        <div className="max-w-3xl mx-4 sm:mx-auto py-8 px-8 md:px-20 rounded-xl bg-bright/5 text-gray-800">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-8 gap-2 flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-bright rounded-full float-animation">
              <PenTool className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            자기소개서 피드백
          </h1>

          <label className="block mb-2 font-semibold">
            자기소개서 문항
          </label>
          <textarea
            rows={1}
            className="w-full border border-gray-500 rounded-lg p-3 mb-5 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="자기소개서 문항을 입력해 주세요..."
          />

          <label className="block mb-2 font-semibold">
            작성한 자기소개서
          </label>
          <textarea
            rows={7}
            className="w-full border border-gray-500 rounded-lg p-3 mb-5 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none bg-white"
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="여기에 자기소개서를 붙여넣어 주세요..."
          />

          <label className="block mb-2 font-semibold">
            피드백 스타일 선택
          </label>
          <select
            className="w-full border border-gray-500 rounded-lg p-3 mb-8 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer bg-white"
            value={feedbackStyle}
            onChange={(e) => setFeedbackStyle(e.target.value)}
          >
            <option value="T형 전문가">T형 전문가 🧠</option>
            <option value="F형 전문가">F형 전문가 🔍</option>
            <option value="럭키비키">럭키비키 🦄</option>
            <option value="오은영">오은영 🧸</option>
            <option value="백종원">백종원 🍳</option>
            <option value="전문가">전문가 🧑‍🏫</option>
          </select>

          <button
            onClick={handleEvaluate}
            disabled={loading || !questionText || !essayText}
            className={`w-full py-3 font-bold rounded-full text-white shadow-lg transition-transform
              ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-dark hover:scale-103 "
              }`}
          >
            {loading ? "피드백 생성 중... (최대 1분)" : "펀 피드백 받기!"}
          </button>
        </div>
        <div ref={resultRef}>
        {result && personaResult && (
          <div className="max-w-3xl mx-auto">
            <section className="mt-10 bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-bold text-blue-600">
                최종 점수: 
                <p className="flex items-center text-3xl gap-2">{result.final_score}/100점 {getScoreIcon(result.final_score)}</p>
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="min-w-2/5 flex flex-col justify-start gap-2 ">
                  {Object.entries(result.feedback_dict.항목별_평가).map(
                    ([key, val]) => (
                      <article
                        key={key}
                        className="px-4 py-2 rounded-lg border border-blue-200 shadow-sm hover:shadow-lg transition cursor-pointer"
                        title={val.피드백}
                      >
                        <h3 className="flex gap-2 font-semibold text-md mb-1 text-gray-700">
                          {key.replace(/_/g, ' ')}:<span className="font-bold text-md flex items-center">{[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < val.점수 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}</span>
                        </h3>
                        <p className="text-gray-500 text-xs">{val.설명}</p>
                      </article>
                    )
                  )}
                </div>
                <div>
                  <section className="bg-blue-50 rounded-lg p-5 font-semibold shadow-md animate-fadeIn">
                    <h3 className="mb-2 ">✨ {feedbackStyle} 피드백 ✨</h3>
                    <p>{personaResult}</p>
                  </section>
                  <blockquote className="italic pl-4 mt-6">
                    {result.feedback_dict.총괄_피드백}
                  </blockquote>
                </div>
              </div>  
            </section>
          </div>
        )}
        </div>
      </div>
    </AuthCheck>
  );
}
