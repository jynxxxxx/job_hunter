import React from 'react';

interface HyundaiGuideOutputProps {
  result: {
    core_keywords: string[];
    key_experiences: string[];
    applicant_character: string;
    outline: string[];
    review_from_interviewer: string[];
  };
}

const  HyundaiGuideResult = ({ result }: HyundaiGuideOutputProps) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <section className="mb-12">
        <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">1. 핵심 강점 키워드</h2>
        <div className="flex flex-wrap gap-2">
          {result.core_keywords.map((kw) => (
            <span
              key={kw}
              className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold"
            >
              {kw}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">2. 대표 경험 요약</h2>
        <ul className="space-y-3 text-gray-800">
          {result.key_experiences.map((exp, i) => (
            <li key={i} className="bg-gray-50 p-4 rounded-md shadow-sm border-l-4 border-blue-300">
              {exp}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">3. 당신을 정의하는 한 문장</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-5 italic text-blue-900 shadow-sm">
          “{result.applicant_character}”
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">4. 자소서 흐름 시나리오 요약</h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-800">
          {result.outline.map((point, i) => (
            <li key={i} className="bg-white border-l-4 border-dark pl-4 py-2">
              {point}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">5. 면접관 피드백 관점에서 본 당신</h2>
        <div className="space-y-4 text-gray-700">
          {result.review_from_interviewer.map((r, i) => (
            <blockquote key={i} className="bg-gray-100 border-l-4 border-gray-400 p-4 italic text-sm">
              “{r}”
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HyundaiGuideResult;