import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import QuestionForm from "@/templates/QuestionForm";
import { handleUpload } from "@/hooks/useUploadHandler";
import { getQuestionTemplate } from "@/questionTemplates";

interface DynamicQuestionSectionProps {
  job_id: string;
  section: string; // e.g. "q1", "q2", "q3", ...
  question_id: number;
  setGuide: (guide: any) => void;
  setEssay: (essay: any) => void;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
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
  running,
}: DynamicQuestionSectionProps) => {
  const { authUser } = useAuth();
  const { userData } = useUserData();

  const template = getQuestionTemplate(job_id);
  const questions = template?.[section as keyof typeof template];
  const defaultForm = template?.[`defaultForm${section.toUpperCase()}` as keyof typeof template] || {};
  // Ensure questions is always an array for rendering
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
