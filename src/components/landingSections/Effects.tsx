

import effectStyles from "@/styles/effects.module.scss";

const Effects = () => {
    const features = [
    {
      img: '/icons/thumbsup.svg',
      title: '지원서 작성 시간 최대 90% 단축',
      description:
        '빠르고 쉽게, 더 많은 공고에 지원할 수 있습니다.',
    },
    {
      img: '/icons/heart.svg',
      title: '답장률 3배 증가',
      description:
        '기업 가치에 딱 맞는 자기소개서로 더 많은 관심을 받으세요.',
    },
    {
      img: '/icons/cycle.svg',
      title: '지원 횟수 대폭 증가',
      description:
        '반복 작업 자동화로 부담 없이 다양한 공고에 도전하세요.',
    },
    
  ]
  return (
    <section className={effectStyles.ctn}>
      <p className={effectStyles.header}>      
        당신의 취업 여정, 처음부터 끝까지 함께합니다.
        <br /> 더 빠르게, 더 많이, 더 나은 지원을 경험하세요
      </p>
      <div className={effectStyles.items}>
        {features.map((card, i) => (
          <div key={i} className={effectStyles.card}>
            <img src={card.img} alt="" className={effectStyles.icon} />
            <div className={effectStyles.title}>{card.title}</div>
            <div className={effectStyles.description}>{card.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Effects;


