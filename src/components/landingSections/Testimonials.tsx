"use client"

import React from "react";
import { Star } from 'lucide-react';
import testimonialStyles from "@/styles/testimonials.module.scss";

const testimonials = [
  {
    name: "김*민",
    role: " 취업 준비생",
    quote: "처음엔 크몽 첨삭 썼는데, 여기가 문장 구성력이나 항목 정리가 훨씬 나았어요. 현대로템 포함 10군데 넘게 썼고, 다음에도 여기 이용할 거예요.",
    rating: 5,
    avatarBg: "#d1fae5",
    avatarColor: "#059669"
  },
  {
    name: "최*수",
    role: "첫 취업 준비생",
    quote: "챗GPT는 너무 AI 같고 어색했어요. 근데 여기선 추천도 잘 해주고, 말이 자연스럽게 이어졌어요. 첫 취업이라 막막했는데 큰 도움 됐습니다. 현차 생산직 지원 성공적으로 마쳤어요.",
    rating: 5,
    avatarBg: "#d1fae5",
    avatarColor: "#059669"
  },
  {
    name: "김*선",
    role: "재직자",
    quote: "재직 중이라 자기소개서를 쓸 시간이 없었어요. 항목도 정확히 잡아주고 2~3번 빠르게 받을 수 있어서 만족했습니다. 솔직히 없었으면 이틀은 걸렸을 거예요",
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
    role: "신입 구직자",
    quote: "GPT도 써봤는데 너무 기계적이고 똑같은 말이 반복돼요. 여긴 진짜 제 경험에서 중요한 포인트만 잡아줘서 훨씬 깔끔했어요. 한 번 더 사용할 예정입니다",
    rating: 5,
    avatarBg: "#dbeafe",
    avatarColor: "#2563eb"
  },
  {
    name: "김*수",
    role: "데이터 분석 지원자",
    quote: "공채 시즌에 20곳 넘게 지원했는데, 바로지원 덕분에 각각 다른 자기소개서를 쉽게 작성할 수 있었어요.",
    rating: 5,
    avatarBg: "#dbeafe",
    avatarColor: "#2563eb"
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
          대학생과 취준생이 선택한 이유,&nbsp;<div className="h-px sm:hidden"><br/></div>직접 들어보세요.
        </p>
      </header>

      <div className={testimonialStyles.carouselWrapper}>
        <div className={testimonialStyles.carouselTrack}>
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div className={testimonialStyles.card} key={index}>
              <div style={{width: '100%', display: 'flex'}}>
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
