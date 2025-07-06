import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import QuestionForm from "@/templates/QuestionForm";
import { handleUpload } from "@/hooks/useUploadHandler";
import { getQuestionTemplate } from "@/questionTemplates";

interface DynamicQuestionSectionProps {
  company: string;
  job: string;
  section: string; // e.g. "q1", "q2", "q3", ...
  questionId: number;
  setGuide: (guide: any) => void;
  setEssay: (essay: any) => void;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
}

const DynamicQuestionSection = ({
  company,
  job,
  section,
  questionId,
  setGuide,
  setEssay,
  waiting,
  setWaiting,
}: DynamicQuestionSectionProps) => {
  const { authUser } = useAuth();
  const { userData } = useUserData();

  const template = getQuestionTemplate(company, job);
  // Dynamically get all question sections (q1, q2, q3, ...)
  const sectionKeys = template ? Object.keys(template).filter((k) => /^q\d+$/.test(k)) : [];
  const questions = template?.[section as keyof typeof template];
  const defaultForm = template?.[`defaultForm${section.toUpperCase()}` as keyof typeof template] || {};
  // Ensure questions is always an array for rendering
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const numQuestions =
    template?.numQuestions?.[section as keyof typeof template.numQuestions] ??
    safeQuestions.length;

  const hasJobOptions = safeQuestions.some(q => q.type === "jobOptions");
  const [jobLevel1, setJobLevel1] = useState("");
  const [jobLevel2, setJobLevel2] = useState("");
  const [jobLevel3, setJobLevel3] = useState("");

  const [form, setForm] = useState<any>({ ...defaultForm });
  const [draft, setDraft] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = Object.keys(defaultForm);
    handleUpload({
      userData,
      authUser,
      form,
      questionId,
      draft,
      requiredFields,
      setWaiting,
      setEssay,
      setGuide,
      company,
    });
  };

  return (
    <QuestionForm
      questions={safeQuestions as import("@/types/forms").Question<any>[]}
      form={form}
      setForm={setForm}
      draft={draft}
      setDraft={setDraft}
      disabled={!userData?.hasPaid || waiting}
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
