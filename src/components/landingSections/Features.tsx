"use client"

import Image from "next/image";


const Features = () => {
  const cards = [
    {
      title: "합격 구조 패턴 반영 ",
      description: "질문 의도에 맞는 구성과 합격 구조 패턴으로 글을 재구성해, 흐름과 설득력을 높입니다.",
    },
    {
      title: "직무-회사 맞춤 첨삭",
      description: "지원하는 채용 공고를 바로지원 AI가 분석해 기업 정보, 인재상, 직무에 필요한 핵심 스킬을 파악하여 반영합니다.",
    },
    {
      title: "지원자 경험을 부각 ",
      description: "추가 질문을 통해, 경험의 본질을 흐리지 않으면서, 더 임팩트있게 전달될 수 있도록 글을 다듬고 보완합니다.",
    }
  ]

  return (
    <div className="flex justify-center bg-bright/5">
      <div className="min-h-fit grid grid-cols-1 md:grid-cols-2 px-8 py-16 justify-center items-center max-w-[1500px]">
        <div className="hidden md:inline relative w-[45vw] h-[45vw] 2xl:h-[40vw] 2xl:w-[40vw] p-4">
          <Image
            src="/revision.png"
            alt="website screenshot"
            fill
            className="object-contain"
          />
        </div>
        <div className="lg:px-8 flex flex-col gap-4 sm:gap-4 xl:gap-8">
          <h1 className="text-center font-extrabold text-3xl mlg:text-5xl text-gray-900">
            기업 맞춤형 피드백과 첨삭
          </h1>
          {cards.map((card, idx) => (
            <div key={idx} className="gap-2 h-full w-full">
              <h2 className="text-gray-900 font-extrabold text-xl px-6 py-2">
                {card.title}
              </h2>
              <h4 className="text-md text-gray-500 px-6 pb-4">
                {card.description}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
