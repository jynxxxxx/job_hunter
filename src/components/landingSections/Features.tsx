import featureStyles from "@/styles/features.module.scss";
import { FileText, Target, Calendar, Building, PenTool, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "자동 맞춤 이력서 생성",
    description: "각 채용공고에 맞춰 AI가 자동으로 이력서를 최적화합니다. 더 이상 수십 개의 이력서를 따로 만들 필요 없어요.",
    color: "blue"
  },
  {
    icon: PenTool,
    title: "AI 기반 자기소개서 작성",
    description: "모든 지원 현황과 마감일을 한눈에 관리하세요. 이제 놓치는 기회란 없습니다.",
    color: "green"
  },
  {
    icon: Calendar,
    title: "공채 시즌 자동 정리",
    description: "대기업부터 스타트업까지, 마감일과 분야별로 자동 정리된 공채 정보를 받아보세요.",
    color: "purple"
  },
  {
    icon: Building,
    title: "맞춤 채용 공고 추천",
    description: "나의 전공과 관심 분야에 딱 맞는 채용공고만 골라서 추천해드립니다.",
    color: "orange"
  },
  {
    icon: Target,
    title: "나만을  Career Path추천",
    description: "기업의 가치와 나의 경험을 결합한 맞춤형 자기소개서 문장을 AI가 작성해줍니다.",
    color: "pink"
  },
  {
    icon: Zap,
    title: "AI기반 모의 면접 서비스",
    description: "반복적인 개인정보 입력은 그만! 원클릭으로 지원서를 자동 완성하세요.",
    color: "indigo"
  }
];

const Features = () => {
  return (
    <section className={featureStyles.ctn}>
      <div className={featureStyles.header}>
        <h2 className={featureStyles.title}>
          당신의 취업 성공을 위한 AI 파트너입니다.
        </h2>
        <p className={featureStyles.subtitle}>
          이력서 작성부터 지원서 자동 완성까지, 
          <br />취업 준비의 모든 과정에 복잡한 구직 과정을 간편하고 빠르게 도와드립니다.
          
        </p>
      </div>

        <div className={featureStyles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={featureStyles.card}>
              <div className={featureStyles.cardHeader}>
                <feature.icon className={featureStyles.icon}/>
                <h3 className={featureStyles.cardTitle}>{feature.title}</h3>
              </div>
              {/* <p className={featureStyles.cardDescription}>{feature.description}</p> */}
            </div>
          ))}
        </div>

    </section>
  );
};

export default Features;