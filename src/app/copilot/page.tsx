'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from '@/styles/copilot.module.scss'
import heroStyles from '@/styles/hero.module.scss'
import genStyles from '@/styles/generation.module.scss'
import ApplicationPosting from "@/components/landingSections/ApplicationPosting";

export default function CoPilotPage() {
  const words = ["서류 합격", "면접 합격", "취업 성공", "맞춤 공고"];
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 100 : 90;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayed(prev => prev.slice(0, -1));
      } else {
        setDisplayed(prev => currentWord.slice(0, prev.length + 1));
      }

      // Switch to next word when deletion is done
      if (!isDeleting && displayed === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause after typing
      } else if (isDeleting && displayed === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  const handleStart = () => {
    const target = document.getElementById("pricing");
    if (target) {
      const yOffset = window.innerHeight * 0.1; // 10vh offset
      const y = target.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const experts = [
    {
      img:"/expert1.png",
      title:"15년 경력의 커리어 전문가",
      subtitle: "수많은 지원자의 취업을 이끈, 커리어 컨설턴트와 1:1 미팅을 진행하세요",
      certs:[
        "UCLA HR Management Certificate",
        "미시간주립대(MSU) Hospitality Business 전공",
        "이력서부터 면접 대비까지 전 과정 컨설팅으로 구직자 약 200명 취업 성공",
        "진로설계부터 면접 대비까지 전 과정을 아우르는 1:1 컨설팅 경험",
        "구직자 유형별(신입, 전직, 경단녀 등) 맞춤형 컨설팅 프로그램 기획",
        "최신 채용 트렌드와 인사 담당자 관점을 반영한 실전형 피드백 제공",
        "취업 전문 교육기관 및 커리어 플랫폼 자문 경험 보유",
      ],
      link: "https://calendly.com/teambarojiwon/30"
    },
    {
      img:"/expert2.png",
      title:"IT분야 커리어 전문가",
      subtitle: "AI, IT 업계의 합격을 이끌어낸 커리어 전문가와 함께 상담하세요",
      certs:[
        "KAIST 학부, 석사 졸업(AI Lab)",
        "스타트업 창업, 카카오, 네이버 합격 경험",
        "면접관으로 100번 이상 참여 및 코딩테스트 설계",
        "진로설계부터 면접 대비 컨설팅 경험",
        "AI, Machine Learning Engineering의 멘토로 2년간 교육 진행",
      ],
      link: "https://calendly.com/teambarojiwon/30-clone"
    },
    {
      img:"/expert3.png",
      title:"해외기업 커리어 전문가",
      subtitle: "글로벌 무대에서 경쟁력 있는 커리어 경로를 함께 설계해드립니다",
      certs:[
        "UCLA Psychobiology 학부 졸업, bilingual(English, Korean)",
        "미국/국내 실리콘밸리 스타트업에서 3년간 전략 기획 및 시장 분석 업무 수행",
        "해외 비즈니스 개발 및 파트너십 구축 경험 다수 (미국, 유럽 시장 중심)",
        "다국적 기업 문화 이해 및 글로벌 팀 협업 프로젝트 리드",
        "영어 비즈니스 커뮤니케이션 및 프레젠테이션 전문가",
      ],
      link: "https://calendly.com/teambarojiwon/30-clone-1"
    }
  ];

  // const revisionFeatures = [
  //   {
  //     title: "합격 구조 패턴 반영",
  //     description:
  //       "질문 의도에 맞는 구성과 합격 구조 패턴으로 글을 재구성해, 흐름과 설득력을 높입니다.",
  //   },
  //   {
  //     title: "직무-회사 맞춤 첨삭",
  //     description:
  //       "지원하는 채용 공고를 분석해 기업 정보, 인재상, 직무에 필요한 핵심 스킬을 파악하여 반영",
  //   },
  //   {
  //     title: "지원자 경험을 부각",
  //     description:
  //       "추가 질문을 통해, 경험의 본질을 흐리지 않으면서, 더 임팩트있게 전달될 수 있도록 글을 다듬고 보완",
  //   },
  // ];
  
  const checks = [
    '채용 전문가와 주 1회 1:1 화상 미팅진행',
    '기업 맞춤형 자소서 작성 + 첨삭까지 완성',
    '1:1 면접 코칭으로 실전까지 완벽 준비 (모의면접 진행)',
    'AI Agent가 스펙 기반 기업 공고를 실시간 추천',
    '기업별 최신 트렌드 기반 면접 정보 자동 제공',
    '고객 스펙·성향 맞춤형 커리어 방향성 및 전략 설계',
  ]

  const services = [
    {
      title: "채용 전문가가 설계하는 1:1 커리어 전략",
      img:"/consulting.png"
    },
    {
      title: "[AI 추천] 스펙 기반 수시공고 실시간 매칭",
      img:"/screen.png"
    },
    {
      title: "합격률 높이는 기업 맞춤 자소서 코칭",
      img:"/interview.png"
    },
    {
      title: "1:1 면접 코칭으로 실전까지 준비",
      img:"/clipboard.png"
    },
  ];

  return (
    <>
      <ApplicationPosting />
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-dark via-dark to-blue-600 flex w-full justify-center'>
        <section className={`${heroStyles.ctn} grid grid-rows-2 sm:grid-rows-[1fr] sm:grid-cols-[1.4fr_1fr] md:w-4/5 2xl:w-7/10`}>
          <div className='flex flex-col justify-center'>
            <div className={heroStyles.title}>
              나도 몰랐던 합격의 기회.<br/>
              커리어 전문가와 AI와 함께
            </div>
            <div className={heroStyles.subtext}>
              계속 서탈 중이라면, 뭐가 문제인지 분석해드립니다.<br/>
              1달이내 서류 합격률 93%, 2달이내 최종 합격률 78%
              {/* 치열해진 서류경쟁, AI Copilot 기술과&nbsp;<br className="sm:hidden" />3000건의 합격 데이터로
              
              &nbsp;<br className="hidden xl:block" />채용담당자 눈에 띄는&nbsp;<br className="sm:hidden" />자기소개서를 완성하세요 */}
            </div>
            <div className='grid grid-rows-1 sm:grid-cols-2 sm:w-fit gap-2 sm:gap-4 mt-10 px-12 sm:px-0 mb-8 sm:mb-0'>
              <button
                className={`${heroStyles.herobtn} bg-blue-500 text-white w-full`}
                onClick={handleStart}
              >
                신청하기
              </button>
            </div>
          </div>
          <div className="relative w-full h-full pb-6">
            <Image
              src="/woman.png"
              alt="resume"
              fill
              className="object-contain sm:object-cover overflow-visible"
            />
          </div>
        </section>
      </div> 

      {/* Features Section */}
      <section className="text-gray-900 py-16 flex flex-col items-center">
        <div className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-[auto_1fr] w-fit mx-auto text-extrabold text-3xl sm:text-5xl">
          <div className="w-[8ch]">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">{displayed}</span>
            <span className={styles.blinkingCursor}>|</span>
          </div>
          <div>
            위한 커리어 전문가 + AI
          </div>
        </div>
        <div className="w-fit flex flex-col gap-2 text-center pt-4 pb-4">
          <div className="text-lg sm:text-2xl">1달 이내 서류합격 못할시&nbsp;<br className="sm:hidden" /><strong className="text-bright">100% 전액 환불</strong></div>
          <div className="text-xs">*단, 컨설턴트와 최소 2회 미팅(및 첨삭) 및 3곳 이상 지원시</div>
        </div>
        <div className="relative w-full h-[50vh] pb-6">
          <Image
            src="/copilot.png"
            alt="Before and after image of man."
            fill
            className="object-contain rounded-2xl"
          />
        </div>
      </section>

      {/* Explanation Section */} 
      <section className='bg-bright/5 flex w-full justify-center' >
        <div className={`py-16 text-gray-900 grid grid-rows-1 sm:grid-cols-[1fr_1.2fr] items-center sm:gap-8 w-4/5 2xl:w-7/10 2xl:gap-16`}>
          <div className="hidden sm:block relative w-full h-[60vh] sm:w-full pb-6">
            <Image
              src="/consult.png"
              alt="resume"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-center text-3xl font-extrabold">
              내 스펙과 경험을&nbsp;<br className="sm:hidden" />분석하여 전략 설계 
            </div>
            <div className="text-xl font-bold text-gray-700">
              커리어 컨설턴트와 1:1 화상미팅한 내용을 바탕으로, AI Agent가 초기 전략 설계와
              지원자의 새로운 가능성을 분석합니다.
            </div>
            <div className="">
              저희는 지원자가 지금까지 해온 경험과 스펙을 바탕으로 만들 수 있는 방향을 설정하고
              준비 과정을 돕습니다. 점점 복잡해지고 어려워지는 구직 경쟁 속에서, 회사 맞춤형 자소서· 면접 전략을 바탕으로 개인의 역량을 최대화하는 전략 설계는 요즘 취업 준비에 필수입니다.
              또한, 수시채용이 많아지는 요즘 채용시장에 맞춰서, 일일이 기업의 공고를 파악하지 못하는 어려움을 AI Agent 기술을 통해, 지원자에게 적합한 채용을 매일 자동으로 찾을 뿐 아니라 공고별 맞춤 전략을 수립합니다. 이를 통해, 지원자의 길어지는 취업 준비기간을 줄이며 이후 대기업 및 더 좋은 공고에 유리한 고지를 선점할 수 있는 커리어를 갖추게 됩니다.
            </div>
          </div> 
        </div>     
      </section>

      {/* Expert Intro */}
      <section className='bg-white flex w-full justify-center py-16' >
        <div className={`bg-gray-200/50 pt-8 sm:py-8 px-4 sm:px-12 rounded-xl text-gray-900 w-9/10 sm:w-4/5 2xl:w-1/2`}>
          <div className="space-y-12 w-fit mx-auto">
            {experts.map((expert, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-2 sm:gap-8 mb-16 ${
                  idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-7/10 text-gray-800">
                  <h3 className="text-xl font-bold mb-2">{expert.title}</h3>
                  <p className="text-base text-gray-600 mb-4">{expert.subtitle}</p>
                  <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed text-gray-500">
                    {expert.certs.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="relative w-full h-[13rem] sm:h-[20rem] sm:w-[20vw]">
                    <Image
                      src={expert.img}
                      alt={expert.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    className="bg-extraDark text-white py-2 px-4 mt-4 rounded hover:scale-103"
                  >
                    <a href={expert.link}>이 전문가와 무료 상담 예약하기</a>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>     
      </section>

      {/* Revision Section */} 
      {/* <section className='bg-bright/5 flex w-full justify-center' >
        <div className={`py-16 text-gray-900  items-center sm:gap-8 w-9/10 sm:w-7/10 2xl:w-1/2 2xl:gap-16`}>
          <div className="flex flex-col gap-4">
            <div className="text-center text-3xl font-extrabold">
              지원 회사/직무를 반영한&nbsp;<br className="sm:hidden" />맞춤 설계형 자소서 */}
              {/* &nbsp;<br className="sm:hidden" /> */}
            {/* </div>
            <div className="text-lg font-bold text-gray-700">
              커리어 컨설턴트가 지원 회사/직무 맞춤형 자기소개서를 작성 및 첨삭해줍니다.&nbsp;<br className="sm:hidden" />
              지원자의 경험을 녹여내기 위해, 1회 미팅이 진행됩니다.
            </div>
            <div className="">
              커리어 전문가와 지원자의 1:1 화상미팅을 기반하여, 지원 회사/직무 맞춤형 자소서가 작성됩니다. 지원자의 경험이 담긴 단순한 글이 아닌, 합격을 위한 글이 완성됩니다. 또한, 자소서를 바탕으로 이후에 진행될 면접 예상질문과 답변도 같이 제공됩니다.
            </div>
            <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-4 sm:gap-8 py-8">
              {revisionFeatures.map((feat, idx) => (
                <div key={idx} className="bg-white border border-gray-300 rounded-xl p-4"> 
                  <div className="font-bold">{feat.title}</div>
                  <div className="text-sm">{feat.description}</div>
                </div>
              ))}
            </div>
          </div> 
        </div>     
      </section> */}

      {/* Services description */}
      <section className='flex flex-col w-full justify-center items-center gap-8 py-16' >
        <h1 className="text-center text-3xl font-extrabold ">바로지원과 함께</h1>
        <div className="mx-auto grid grid-cols-1 px-4 sm:mx-0 sm:grid-cols-2 w-fit justify-center gap-x-4 pb-8">
          {checks.map((text, idx) => (
            <div key={idx} className="">
              <span className="text-green-700 mt-1">✔</span>
              <span className="text-lg leading-snug">{text}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-fit max-w-screen-lg">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="relative w-[11rem] sm:w-[15rem] aspect-square bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${service.img})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-[9rem] h-[9rem] sm:w-[13rem] sm:h-[13rem] border-4 border-white rounded-full flex items-center justify-center text-white text-center px-3 text-lg sm:text-xl font-bold leading-tight">
                  {service.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Consulting */} 
      <section id="pricing" className='pb-16' >
        <h2 className="pt-16 text-2xl sm:text-4xl text-center text-gray-900 font-extrabold">30분 무료 상담</h2>
        <div className="flex flex-col sm:flex-row w-fit gap-2 sm:gap-8 justify-center mx-auto">
          {experts.map((expert, idx) => (
            <div
              key={idx}
              className=" "
            >
              <button
                className="w-4/5 bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:scale-103 w-[15rem] shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              >
                <a href={expert.link}>{expert.title}와<br/>무료 상담 예약하기</a>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Info */} 
      <section className='bg-white flex flex-col w-full justify-center items-center px-4 pb-16' >
        <h2 className="pt-16 text-2xl sm:text-4xl text-center text-gray-900 font-extrabold">취업 컨설팅 신청 및 문의</h2>
        <h3 className="text-center text-gray-700 text-md sm:text-xl mt-4">
          전략부터 실행까지, 3달만에 100명의 고객이 선택한 채용전문가 + AI 기반 통합 컨설팅<br/>
          KAIST 연구원의 AI Agent기술 도입으로, 고객의 전략적 취업 성공과 탄탄한 커리어를 설계합니다.<br/>
          전화 문의: 010-8961-1918
        </h3>
        <button
          className={`${heroStyles.herobtn} bg-blue-500 text-white w-fit mt-4`}
          onClick={()=>setOpen(true)}
        >
          신청하기
        </button>
      </section>

      {open && (
        <>
          <div className={genStyles.paywallOverlay}></div>
          <div className={`relative ${genStyles.paywallMessage}`}>
            <div className='bg-white flex flex-col w-full justify-center items-center' >
              <h2 className="pt-8 text-4xl text-center text-gray-900 font-extrabold">결제 안내</h2>
              <h3 className="bg-blue-500 text-white rounded-3xl py-2 px-8 text-xl mt-4 font-extrabold mb-4"><span className="line-through">200,000원</span> → 50,000원</h3>
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
            <button
              onClick={()=> setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
        </> 
      )}
      
    </>
  );
}