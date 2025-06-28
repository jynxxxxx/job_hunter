import React, { useState } from "react";
import hdStyles from "@/styles/hyundai.module.scss";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useUserData } from "@/context/UserDataContext";
import { generateOutline } from "@/app/api/generate";
import { handleUpload } from "@/hooks/useUploadHandler";
import { HyundaiGuideOutputProps, Question } from "@/types/forms";
import QuestionForm from "@/templates/QuestionForm";

interface Question3Form {
  goalFree: string | null;
  goalToggle: string | null;
  reasonsFree: string | null;
  reasonsToggle: string [];
  difficultiesFree: string  | null;
  difficultiesToggle: string [];
  solutionsFree: string  | null;
  solutionsToggle: string [];
  lessonsFree: string  | null;
  lessonsToggle: string [];
}

const MAX = {
  reasons: 2,
  difficulties: 2,
  solutions: 2,
  lessons: 2,
};

const optionsMap = {
  goalOptions: [
    "자격증 따기 (기능사, 산업기사 등)",
    "캡스톤·설계 프로젝트 완수",
    "졸업 작품 완성하기",
    "실습 현장 평가 우수 받기",
    "시뮬레이션·CAD 프로그램 능력 키우기",
    "기능경기대회 준비하기",
    "복잡한 정비·조립 기술 배우기",
  ],
  reasonOptions: [
    "실무 기술 높이고 싶어서",
    "부족한 부분 보완하려고",
    "기술 변화 대비하려고",
    "경쟁력 있는 사람이 되고 싶어서",
    "공정 실습 중 흥미 생겨서",
    "차별화된 기술력을 만들고 싶어서",
  ],
  difficultyOptions: [
    "작업 실수·불량 반복",
    "장비 셋팅·정밀도 맞추기 어려움",
    "공정 오차 맞추기 힘듦",
    "프로그램 (CAD 등) 사용 어려움",
    "품질 기준 유지 힘듦",
    "반복 숙련으로 체력 부담",
    "복잡한 공정 순서 외우기 어려움",
  ],
  solutionOptions: [
    "선배·지도자에게 적극 피드백 받음",
    "공정별 체크리스트 만들어 점검",
    "반복 숙련으로 몸에 익힘",
    "불량 원인 분석표 작성",
    "시뮬레이션 프로그램 꾸준히 연습",
    "학원·영상강의로 부족한 부분 보완",
    "매일 작업기록 작성",
    "모의시험·실습으로 실전 감각 익힘",
  ],
  lessonOptions: [
    "준비 철저함이 불량률 줄인다",
    "문제 원인 빨리 찾는 게 중요하다",
    "현장 감각은 반복 숙련에서 나온다",
    "계획적 연습이 변화를 만든다",
    "디테일이 품질을 만든다",
    "꾸준함이 최고의 경쟁력이다",
    "선배·팀원 조언 활용이 중요하다",
    "현장 표준 지키는 습관이 중요하다",
  ]
}

const defaultForm: Question3Form = {
  goalFree: null,
  goalToggle: null,
  reasonsFree: null,
  reasonsToggle: [],
  difficultiesFree: null,
  difficultiesToggle: [],
  solutionsFree: null,
  solutionsToggle: [],
  lessonsFree: null,
  lessonsToggle: [],
};

const questions: Question<Question3Form>[] = [
  {
    type: "radio",
    label: "내가 스스로 세운 목표는?",
    toggleField: "goalToggle",
    freeField: "goalFree",
    options: optionsMap.goalOptions,
    max: 1,
  },
  {
    type: "checkbox",
    label: "이 목표를 왜 세웠나요? (최대 2개)",
    toggleField: "reasonsToggle",
    freeField: "reasonsFree",
    options: optionsMap.reasonOptions,
    max: 2,
  },
  {
    type: "checkbox",
    label: "목표 달성 중 어려웠던 점은? (최대 2개)",
    toggleField: "difficultiesToggle",
    freeField: "difficultiesFree",
    options: optionsMap.difficultyOptions,
    max: 2,
  },
  {
    type: "checkbox",
    label: "이 어려움을 어떻게 해결했나요? (최대 2개)",
    toggleField: "solutionsToggle",
    freeField: "solutionsFree",
    options: optionsMap.solutionOptions,
    max: 2,
  },
  {
    type: "checkbox",
    label: "이 경험에서 배운 점은? (최대 2개)",
    toggleField: "lessonsToggle",
    freeField: "lessonsFree",
    options: optionsMap.lessonOptions,
    max: 2,
  },
];


const Hyundai_Q3 = ({ setGuide, waiting, setWaiting }: { setGuide: (guide: HyundaiGuideOutputProps | null) => void,  waiting: boolean, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const { userData}  = useUserData()
  const [form, setForm] = useState<Question3Form>(defaultForm);
  const [draft, setDraft] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const requiredFields = Object.keys(defaultForm) as (keyof Question3Form)[];
  
      handleUpload({
        authUser,
        form,
        questionId: 3,
        draft,
        requiredFields,
        setWaiting,
        setGuide,
        company: '현대차동차'
      });
    };

  // useEffect(() => {
  //   console.log("Form data updated:", form);
  // }, [form]);

  return (
    <QuestionForm<Question3Form>
      questions={questions}
      form={form}
      setForm={setForm}
      draft={draft}
      setDraft={setDraft}
      disabled={!userData?.hasPaid}
      onSubmit={handleSubmit}
    />
  );
};

export default Hyundai_Q3;
