"use client"

import Image from "next/image";


const Instructions = () => {
  const cards = [
    {
      title: "채용 공고 분석",
      description: "지원하는 채용 공고를 바로지원 AI가 분석해 기업 정보, 인재상, 직무에 필요한 핵심 스킬 파악",
      image:"",
    },
    {
      title: "합격 자소서 학습",
      description: "3,000 건 이상의 합격 자소서를 학습한 바로지원 AI가 전체 내용과 구조를 설계",
      image:"",
    },
    {
      title: "인사팀 출신의 노하우",
      description: "면접관 관점에서의 중요 포인트, 자소서 작성 가이드라인과 합격 자소서 노하우를 바로지원 AI에 반영",
      image:"",
    }
  ]

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {cards.map((card, idx) => (
          <div key={idx}>
            {/* <div>
              <Image />
            </div> */}
            <div>
              {card.title}
            </div>
            <div>
              {card.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
