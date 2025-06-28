'use client'

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import QuestionForm from "@/templates/QuestionForm";
import { handleUpload } from "@/hooks/useUploadHandler";
import { HyundaiEssayOutputProps, HyundaiGuideOutputProps } from "@/types/forms";

interface Question<T> {
  type: "radio" | "checkbox";
  label: string;
  toggleField: keyof T;
  freeField: keyof T;
  options: string[];
  max: number;
}

interface CollaborationForm {
  workExperienceFree: string | null;
  workExperienceToggle: string | null;
  problemsFacedFree: string | null;
  problemsFacedToggle: string[];
  myRolesFree: string | null;
  myRolesToggle: string[];
  outcomeFree: string | null;
  outcomeToggle: string | null;
  weaknessesFree: string | null;
  weaknessesToggle: string[];
  overcomeEffortsFree: string | null;
  overcomeEffortsToggle: string[];
}

const MAX = {
  problems: 2,
  roles: 2,
  weaknesses: 2,
  efforts: 2,
};

const optionsMap = {
  workOptions: [
    "아르바이트 (식당, 공장, 마트 등)",
    "학교 조별과제",
    "공장 실습 현장",
    "기능경기대회·학원 실습반",
    "졸업 작품·설계 프로젝트"
  ],
  problemOptions: [
    "의견 충돌이 있었다",
    "일정 지연이 발생했다",
    "역할 분담이 잘 안 됐다",
    "작업 실수가 반복됐다",
    "책임 회피가 있었다",
    "의사소통 부족했다"
  ],
  roleOptions: [
    "일정 계획 세우고 조율했다",
    "갈등을 중재했다",
    "부족한 부분을 보완했다",
    "다른 사람 실수를 수습했다",
    "마무리 검사를 맡았다",
    "전체 진행 상황 관리했다",
    "작업 기록·정리·보고서 작성했다",
    "기술적 실무 조언 제공했다"
  ],
  outcomeOptions: [
    "문제가 잘 해결됐다",
    "결과물이 좋아졌다",
    "일정 안에 마무리됐다",
    "서로 만족하며 마무리했다"
  ],
  weaknessOptions: [
    "말하기가 어려웠다",
    "의견을 적극적으로 내지 못했다",
    "리더 역할이 부담스러웠다",
    "감정 조절이 어려웠다",
    "준비가 부족했다",
    "다른 사람 의견을 충분히 듣지 못했다",
    "고집을 조금 부렸다"
  ],
  effortOptions: [
    "말하는 연습을 꾸준히 했다",
    "메모하며 의견 정리하는 습관을 들였다",
    "먼저 다가가 말을 걸어보았다",
    "리더 역할을 작게 시도했다",
    "적극 경청 연습을 했다",
    "실수 시 침착하게 대응하는 훈련을 했다"
  ]
}


const defaultForm: CollaborationForm = {
  workExperienceFree: null,
  workExperienceToggle: null,
  problemsFacedFree: null,
  problemsFacedToggle: [],
  myRolesFree: null,
  myRolesToggle: [],
  outcomeFree: null,
  outcomeToggle: null,
  weaknessesFree: null,
  weaknessesToggle: [],
  overcomeEffortsFree: null,
  overcomeEffortsToggle: [],
};

const questions: Question<CollaborationForm>[] = [
  {
    type: "radio",
    label: "함께 일한 경험은?",
    toggleField: "workExperienceToggle",
    freeField: "workExperienceFree",
    options: optionsMap.workOptions,
    max: 1,
  },
  {
    type: "checkbox",
    label: "어떤 문제가 생겼나요? (최대 2개)",
    toggleField: "problemsFacedToggle",
    freeField: "problemsFacedFree",
    options: optionsMap.problemOptions,
    max: MAX.problems,
  },
  {
    type: "checkbox",
    label: "협업 과정에서 내가 맡은 역할은? (최대 2개)",
    toggleField: "myRolesToggle",
    freeField: "myRolesFree",
    options: optionsMap.roleOptions,
    max: MAX.roles,
  },
  {
    type: "radio",
    label: "결과는 어떻게 됐나요?",
    toggleField: "outcomeToggle",
    freeField: "outcomeFree",
    options: optionsMap.outcomeOptions,
    max: 1,
  },
  {
    type: "checkbox",
    label: "내가 느낀 내 단점은? (최대 2개)",
    toggleField: "weaknessesToggle",
    freeField: "weaknessesFree",
    options: optionsMap.weaknessOptions,
    max: MAX.weaknesses,
  },
  {
    type: "checkbox",
    label: "이걸 극복하려고 어떻게 노력했나요? (최대 2개)",
    toggleField: "overcomeEffortsToggle",
    freeField: "overcomeEffortsFree",
    options: optionsMap.effortOptions,
    max: MAX.efforts,
  },
];


const Hyundai_Q2 = ({ setGuide, setEssay, waiting, setWaiting }: { setGuide: (guide: HyundaiGuideOutputProps | null) => void,  setEssay: (essay: HyundaiEssayOutputProps) => void, waiting: boolean, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const { userData}  = useUserData()
  const [form, setForm] = useState<CollaborationForm>(defaultForm);
  const [draft, setDraft] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = Object.keys(defaultForm) as (keyof CollaborationForm)[];

    handleUpload({
      authUser,
      form,
      questionId: 2,
      draft,
      requiredFields,
      setWaiting,
      setEssay,
      setGuide,
      company: '현대차동차'
    });
  };

  return (
    <QuestionForm<CollaborationForm>
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

export default Hyundai_Q2;
