import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import QuestionForm from "@/templates/QuestionForm";
import { handleUpload } from "@/hooks/useUploadHandler";
import { getQuestionTemplate } from '@/templates/jobQuestions';
import { SectionCounts, SectionKey } from "@/types/forms";

interface DynamicQuestionSectionProps {
  job_id: string;
  section: string; // e.g. "q1", "q2", "q3", ...
  question_id: number | string; // e.g. 1, 2, 3, ...
  setGuide: (guide: any) => void;
  setEssay: (essay: any) => void;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
  setRunning: (running: boolean) => void; // Function to set running state
  running?: boolean; // Optional prop to indicate if generation is running
}

const DynamicQuestionSection = ({
  job_id,
  section,
  question_id,
  setGuide,
  setEssay,
  waiting,
  setWaiting,
  setRunning,
  running,
}: DynamicQuestionSectionProps) => {
  const { authUser } = useAuth();
  const { userData } = useUserData();

  const template = getQuestionTemplate(job_id);
  const questions = template?.[section as keyof typeof template];

  const defaultForm: Record<string, string | string[]> = {};
  
  const sectionKey = `q${question_id}` as SectionKey;
  const numQuestions = template?.numQuestions as SectionCounts;
  const count = numQuestions?.[sectionKey];

  if (typeof count === "number") {
    for (let i = 1; i <= count; i++) {
      const choiceKey = `${i}_choice`;
      const freeKey = `${i}_free`;
      defaultForm[choiceKey] = "";
      defaultForm[freeKey] = "";
    }
  }

  const safeQuestions = Array.isArray(questions) ? questions : [];

  const hasJobOptions = safeQuestions.some(q => q.type === "jobOptions");
  const [jobLevel1, setJobLevel1] = useState("");
  const [jobLevel2, setJobLevel2] = useState("");
  const [jobLevel3, setJobLevel3] = useState("");

  const [form, setForm] = useState<any>({ ...defaultForm });
  const [draft, setDraft] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = Object.keys(defaultForm) as Array<keyof typeof defaultForm>;
    handleUpload({
      userData,
      authUser,
      form,
      question_id,
      draft,
      requiredFields,
      setWaiting,
      setRunning,
      setEssay,
      setGuide,
      job_id,
    });
  };

  return (
    <QuestionForm
      questions={safeQuestions as import("@/types/forms").Question<any>[]}
      form={form}
      setForm={setForm}
      draft={draft}
      setDraft={setDraft}
      disabled={Boolean((!userData?.hasPaid?.[job_id] && (question_id !== 1)) || waiting || running)}
      onSubmit={handleSubmit}
      {...(hasJobOptions && {
        jobLevel1,
        setJobLevel1,
        jobLevel2,
        setJobLevel2,
        jobLevel3,
        setJobLevel3,
      })}
    />
  );
};

export default DynamicQuestionSection;
