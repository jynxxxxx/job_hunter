import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import QuestionForm from "@/templates/QuestionForm";
import { handleUpload } from "@/hooks/useUploadHandler";
import { getQuestionTemplate } from "@/questionTemplates";

interface DynamicQuestionPageProps {
  company: string;
  job: string;
  questionId: number;
  setGuide: (guide: any) => void;
  setEssay: (essay: any) => void;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
}

const DynamicQuestionPage = ({
  company,
  job,
  questionId,
  setGuide,
  setEssay,
  waiting,
  setWaiting,
}: DynamicQuestionPageProps) => {
  const { authUser } = useAuth();
  const { userData } = useUserData();

  const template = getQuestionTemplate(company, job);
  const questions = (template && Array.isArray((template as any).questions)) ? (template as any).questions : [];
  const defaultForm = (template && (template as any).defaultForm) ? (template as any).defaultForm : {};

  const [form, setForm] = useState<any>({ ...defaultForm });
  const [draft, setDraft] = useState("");

  // For jobOptions type, handle jobLevel1/2/3 if present in questions
  const hasJobOptions = Array.isArray(questions) && questions.some((q: any) => q.type === "jobOptions");
  const [jobLevel1, setJobLevel1] = useState("");
  const [jobLevel2, setJobLevel2] = useState("");
  const [jobLevel3, setJobLevel3] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedForm = { ...form };
    if (hasJobOptions) {
      let finalJobType = "";
      if (jobLevel3) finalJobType = jobLevel3;
      else if (jobLevel2) finalJobType = jobLevel2;
      else if (jobLevel1) finalJobType = jobLevel1;
      updatedForm = {
        ...updatedForm,
        jobType_free: "없음",
        jobType_toggle: [finalJobType],
      };
    }
    const requiredFields = Object.keys(defaultForm);
    handleUpload({
      userData,
      authUser,
      form: updatedForm,
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
      questions={questions}
      form={form}
      setForm={setForm}
      draft={draft}
      setDraft={setDraft}
      disabled={((userData?.generation_count ?? 0) > 2 && !userData?.hasPaid) || waiting}
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

export default DynamicQuestionPage;
