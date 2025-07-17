"use client"

import Image from "next/image";


const Instructions = () => {
  const cards = [
    {
      title: "지원자의 이야기",
      description: "각 문항에 필요한 지원자의 경험과 이야기를 세부   문항으로 입력받아 강점이 도출된 차별화된 자소서",
      image:"/step1.png",
    },
    {
      title: "합격 자소서 학습",
      description: "3,000 건 이상의 합격 자소서를 학습한 바로지원 AI가 전체 내용과 구조를 설계",
      image:"/step2.png",
    },
    {
      title: "직무 합격 키워드 기반",
      description: "기업의 AI 채용 필터링을 위한 키워드 적용과, 해당 직무의 합격 키워드를 반영한 합격 가능한 자소서",
      image:"/step3.png",
    }
  ]

  return (
    <div className="min-h-fit flex flex-col justify-center gap-8 py-16 md:py-32">
      <h1 className="font-extrabold text-3xl mlg:text-5xl text-gray-700 px-4 xl:px-32">
        AI Copilot과&nbsp;<div className="h-px sm:hidden"><br/></div>함께 작성하세요
      </h1>
      <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4 xl:gap-8">
        {cards.map((card, idx) => (
          <div key={idx} className="flex flex-col gap-2 bg-light h-full w-full border border-dark/40 rounded-2xl">
            <div className="relative w-full h-[13rem] xl:h-[15rem] bg-[#D6F4FF] rounded-t-2xl">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-contain rounded-t-2xl"
              />
            </div>
            <h2 className="font-extrabold text-xl px-6 py-2">
              {card.title}
            </h2>
            <h4 className="text-md text-gray-500 px-6 pb-4">
              {card.description}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
