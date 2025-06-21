"use client"

import React from "react";
import { Star } from 'lucide-react';
import testimonialStyles from "@/styles/testimonials.module.scss";

const testimonials = [
   {
    name: "김*수",
    role: "데이터 분석 지원자",
    quote: "공채 시즌에 20곳 넘게 지원했는데, 바로지원 덕분에 각각 다른 자기소개서를 쉽게 작성할 수 있었어요.",
    rating: 5,
    avatarBg: "#dbeafe",
    avatarColor: "#2563eb"
  },
  {
    name: "박*영",
    role: "3년차 마케터, 이직 준비 중",
    quote: "마감일 관리가 정말 힘들었는데, 바로지원이 자동으로 정리해줘서 놓친 지원 기회가 하나도 없었어요. 추천합니다!",
    rating: 5,
    avatarBg: "#d1fae5",
    avatarColor: "#059669"
  },
  {
    name: "이*우",
    role: "UX 디자이너 취업 준비생",
    quote: "포트폴리오 정리하느라 바빠서 자소서 쓸 시간이 없었는데, AI가 제 포트폴리오 내용을 반영해서 써줘서 정말 도움됐어요.",
    rating: 5,
    avatarBg: "#fce7f3",
    avatarColor: "#db2777"
  },
  {
    name: "정*진",
    role: "경력직 HR 매니저",
    quote: "다른 툴은 템플릿만 제공하는데, 바로지원은 기업 문화에 맞춰 자소서를 실제로 수정해주니까 신뢰가 갔어요.",
    rating: 5,
    avatarBg: "#ede9fe",
    avatarColor: "#7c3aed"
  },
  {
    name: "오*훈",
    role: "전기전자 전공, 신입 구직자",
    quote: "AI가 제 전공과 희망 직무를 정확히 반영해서 채용공고를 추천해줘서, 무작정 찾는 데 들이던 시간을 아꼈어요.",
    rating: 5,
    avatarBg: "#dbeafe",
    avatarColor: "#2563eb"
  },
  {
    name: "한*수",
    role: "비전공 프론트엔드 개발 지원자",
    quote: "비전공자라 지원서 쓸 때 불안했는데, 바로지원에서 추천한 표현이 실제로 면접에서 칭찬받았어요.",
    rating: 5,
    avatarBg: "#d1fae5",
    avatarColor: "#059669"
  },
  {
    name: "최*준",
    role: "군 전역 후 첫 취업 준비 중",
    quote: "매번 비슷한 자소서 쓰는 게 너무 지쳤는데, 바로지원은 각각 다른 포인트로 작성해줘서 훨씬 수월했어요.",
    rating: 5,
    avatarBg: "#fce7f3",
    avatarColor: "#db2777"
  }
];

const Testimonials = () => {

  return (
    <section className={testimonialStyles.ctn}>
      <header className={testimonialStyles.header}>
        <h2>
          많은 고객들이
          <br />만족하며 이용하고 있어요.
        </h2>
        <p>
          대학생과 취준생이 선택한 이유, 직접 들어보세요.
        </p>
      </header>

      <div className={testimonialStyles.carouselWrapper}>
        <div className={testimonialStyles.carouselTrack}>
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div className={testimonialStyles.card} key={index}>
              <div style={{width: '100%'}}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className={testimonialStyles.icon} />
                ))}
              </div>
              <div className={testimonialStyles.quote}>{testimonial.quote}</div>
              <div className={testimonialStyles.tag}>
                <div 
                  className={testimonialStyles.letter} 
                  style={{
                    backgroundColor: testimonial.avatarBg,
                    color: testimonial.avatarColor,
                  }} 
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div className={testimonialStyles.name}>
                  {testimonial.name}
                  <br /> <span className={testimonialStyles.role}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
