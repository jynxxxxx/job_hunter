import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HyundaiEssayOutputProps, HyundaiGuideOutputProps, Question } from "@/types/forms";
import QuestionForm from "@/templates/QuestionForm";
import { useUserData } from "@/context/UserDataContext";
import { handleUpload } from "@/hooks/useUploadHandler";

interface MobilityForm {
  jobType_free: string | null;
  jobType_toggle: string | null;
  skillReasons_free: string | null;
  skillReasons_toggle: string[];
  futureMobility_free: string | null;
  futureMobility_toggle: string[];
  personalStrengths_free: string | null;
  personalStrengths_toggle: string[];
}

const MAX = {
  skills: 2,
  future: 2,
  strengths: 2,
};

const optionsMap = {
  jobOptions: {
    '직접 생산': {
      '완성차 생산 공정': ['프레스', '차체', '도장', '의장'],
      '파워트레인/시트 생산 공정': ['소재', '엔진·변속기 조립', '시트 (자동차 좌석 제작)']
    },
    '간접 생산': [
      '설비 관리 (장비 고장 예방·유지보수)',
      '생산 관리 (부품·자재 공급 및 일정 관리)',
      '품질 관리 (불량 탐지·품질 개선)'
    ],
  },
  skillOptions: [
    "손재주가 좋고 기계 다루는 게 익숙하다",
    "작업 순서를 빠르게 익히고 반복 숙련에 강하다",
    "꼼꼼해서 실수를 줄이는 데 자신 있다",
    "문제 원인 찾고 개선하는 능력이 있다",
    "속도와 정확성을 동시에 유지할 수 있다",
    "안전 수칙을 철저히 준수하는 습관이 있다",
    "팀원과 소통하며 협업을 잘 한다",
    "새 장비·시스템 배우는 게 흥미롭다",
    '기타'
  ],
  futureOptions: [
    "전기차",
    "수소차",
    "자율주행차",
    "드론·로봇택시 (UAM 포함)",
    "차량 통신 시스템 (V2X)",
    "차량 내 AI 인포테인먼트 시스템",
    "친환경 재활용 소재 활용",
    "무인 물류·운송 시스템",
    '기타'
  ],
  strengthOptions: [
    "불량 원인 빨리 찾는다",
    "실수를 예방하는 점검 습관이 있다",
    "위험 요소를 미리 파악한다",
    "반복 작업에도 집중력을 유지한다",
    "꼼꼼한 품질 체크 능력이 있다",
    "협업 분위기를 만드는 커뮤니케이션이 강하다",
    "변화·새로운 장비 적응력이 빠르다",
    "안전을 항상 최우선으로 생각한다",
    '기타'
  ]
}

const defaultForm: MobilityForm = {
  jobType_free: null,
  jobType_toggle: null,
  skillReasons_free: null,
  skillReasons_toggle: [],
  futureMobility_free: null,
  futureMobility_toggle: [],
  personalStrengths_free: null,
  personalStrengths_toggle: [],
};

const questions: Question<MobilityForm>[] = [
  {
    type: "jobOptions",
    label: "내가 하고 싶은 자동차 생산 일은?",
    toggleField: "jobType_toggle",
    freeField: "jobType_free",
    options: optionsMap.jobOptions,
    max: 1,
  },
  {
    type: "checkbox",
    label: "내가 자동차 기술 일을 잘할 수 있다고 생각하는 이유는? (최대 2개)",
    toggleField: "skillReasons_toggle",
    freeField: "skillReasons_free",
    options: optionsMap.skillOptions, // your array of skills options
    max: MAX.skills,
  },
  {
    type: "checkbox",
    label: "미래 자동차는 어떤 모습이라 생각하나요? (최대 2개)",
    toggleField: "futureMobility_toggle",
    freeField: "futureMobility_free",
    options: optionsMap.futureOptions, // your future mobility options array
    max: MAX.future,
  },
  {
    type: "checkbox",
    label: "나만의 특별한 강점 (최대 2개)",
    toggleField: "personalStrengths_toggle",
    freeField: "personalStrengths_free",
    options: optionsMap.strengthOptions, // your personal strengths options array
    max: MAX.strengths,
  },
];

const Hyundai_Q1 = ({ setGuide, setEssay, setWaiting }: { setGuide: (guide: HyundaiGuideOutputProps ) => void,  setEssay: (essay: HyundaiEssayOutputProps) => void, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const { userData}  = useUserData()
  const [form, setForm] = useState<MobilityForm>(defaultForm);
  const [draft, setDraft] = useState("")
  const [jobLevel1, setJobLevel1] = useState("");
  const [jobLevel2, setJobLevel2] = useState("");
  const [jobLevel3, setJobLevel3] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalJobType = null

    if (jobLevel3 !== ""){
      finalJobType = jobLevel3
    } else if (jobLevel2 !== ""){
      finalJobType = jobLevel2
    } else if (jobLevel1 !== ""){
      finalJobType = jobLevel1
    } else ( finalJobType = "" )

    const updatedForm = {
      ...form,
      jobType_free:"없음",
      jobType_toggle: [finalJobType],
    }

    const requiredFields = Object.keys(defaultForm) as (keyof MobilityForm)[];

    handleUpload({
      userData,
      authUser,
      form: updatedForm,
      questionId: 1,
      draft,
      requiredFields,
      setWaiting,
      setEssay,
      setGuide,
      company: '현대차동차'
    });
  };

  // useEffect(() => {
  //   console.log("Form data updated:", form);
  // }, [form]);

  return (
    <QuestionForm<MobilityForm>
      questions={questions}
      form={form}
      setForm={setForm}
      draft={draft}
      setDraft={setDraft}
      disabled={ (userData?.generation_count ?? 0) > 2 && !userData?.hasPaid }
      onSubmit={handleSubmit}
      jobLevel1={jobLevel1}
      setJobLevel1={setJobLevel1}
      jobLevel2={jobLevel2}
      setJobLevel2={setJobLevel2}
      jobLevel3={jobLevel3}
      setJobLevel3={setJobLevel3}
    />
  )
}

export default Hyundai_Q1;
