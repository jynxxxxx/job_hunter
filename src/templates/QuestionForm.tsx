'use client'

import React, { useState, useEffect } from "react";
import genStyles from "@/styles/generation.module.scss";
import { JobOptions, Question } from "@/types/forms";

interface QuestionFormProps<T> {
  questions: Question<T>[];
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  draft: string;
  setDraft: (val: string) => void;
  disabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
  jobLevel1?: string;
  setJobLevel1?: (val: string) => void;
  jobLevel2?: string;
  setJobLevel2?: (val: string) => void;
  jobLevel3?: string;
  setJobLevel3?: (val: string) => void;
}

export default function QuestionForm<T>({
  questions,
  form,
  setForm,
  draft,
  setDraft,
  disabled,
  onSubmit,
  jobLevel1,
  setJobLevel1,
  jobLevel2,
  setJobLevel2,
  jobLevel3,
  setJobLevel3,
}: QuestionFormProps<T>) {
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [step, setStep] = useState(0);
  const totalSteps = questions.length;
  const currentQuestion = questions[step];

  useEffect(() => {
    if (step === totalSteps) {
      setSubmitEnabled(false);
      const timer = setTimeout(() => {
        setSubmitEnabled(true);
      }, 1000); // 1 seconds delay

      return () => clearTimeout(timer);
    } else {
      setSubmitEnabled(false); // disable when not last step
    }
  }, [step, totalSteps])

  const updateField = (field: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field: keyof T, value: string, max: number) => {
    const current = (form[field] as unknown as string[]) || [];
    if (current.includes(value)) {
      updateField(field, current.filter((v) => v !== value));
    } else {
      if (current.length >= max) return;
      updateField(field, [...current, value]);
    }
  };

  const renderJobOptions = () => {
    const options = currentQuestion.options as JobOptions;
    const level1 = jobLevel1 ? (options[jobLevel1] as string[] | Record<string, string[]>) : null;

    return (
      <>
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr] pt-[1rem] pb-[2rem] ml-[1.5rem]">
          <div className={genStyles.stepGroup}>
            {Object.keys(options).map((job) => (
              <div key={job}>
                <label>
                  <input
                    style={{ marginRight: "6px" }}
                    type="radio"
                    name="job"
                    value={job}
                    checked={jobLevel1 === job}
                    onChange={() => {
                      setJobLevel1?.(job);
                      setJobLevel2?.("");
                      setJobLevel3?.("");
                    }}
                  />
                  {job}
                </label>
              </div>
            ))}
          </div>

          {jobLevel1 && Array.isArray(level1) && (
            <div className={genStyles.stepGroup}>
              {level1.map((job2: string) => (
                <label key={job2}>
                  <input
                    type="radio"
                    name="step2"
                    value={job2}
                    checked={jobLevel2 === job2}
                    onChange={() => {
                      setJobLevel2?.(job2);
                      setJobLevel3?.("");
                    }}
                    style={{ marginRight: "6px" }}
                  />
                  {job2}
                </label>
              ))}
            </div>
          )}

          {jobLevel1 && level1 && !Array.isArray(level1) && (
            <div className={genStyles.stepGroup}>
              {Object.keys(level1).map((job2) => (
                <label key={job2}>
                  <input
                    type="radio"
                    name="step2"
                    value={job2}
                    checked={jobLevel2 === job2}
                    onChange={() => {
                      setJobLevel2?.(job2);
                      setJobLevel3?.("");
                    }}
                    style={{ marginRight: "6px" }}
                  />
                  {job2}
                </label>
              ))}
            </div>
          )}

          {jobLevel1 && jobLevel2 && level1 && !Array.isArray(level1) && Array.isArray((level1 as Record<string, string[]>)[jobLevel2]) && (
            <div className={genStyles.stepGroup}>
              {(level1 as Record<string, string[]>)[jobLevel2].map((job3: string) => (
                <label key={job3}>
                  <input
                    type="radio"
                    name="step3"
                    value={job3}
                    checked={jobLevel3 === job3}
                    onChange={() => setJobLevel3?.(job3)}
                    style={{ marginRight: "6px" }}
                  />
                  {job3}
                </label>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <form 
      className={genStyles.formctn} 
      onSubmit={e => {
        if (!submitEnabled) {
          e.preventDefault();
          return;
        }
        onSubmit(e);
      }}
    >
      <div className="mt-4 flex flex-col mb-2">
        <div className="text-gray-600 font-semibold">
          진행률: {step + 1} / {totalSteps + 1}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded mb-4 mx-auto">
          <div
            className=" h-full bg-bright rounded transition-all duration-300"
            style={{ width: `${((step + 1) / (totalSteps+1)) * 100}%` }}
          />
        </div>
      </div>

      <div className={genStyles.questionCtn}>
        {step < totalSteps && currentQuestion && (
          <div>
            <h2 className={genStyles.question}>{step +1}. {currentQuestion.label}</h2>
            {currentQuestion.type === "jobOptions"
              ? renderJobOptions()
              : (
              <>
                <div className={currentQuestion.type === "radio" ? genStyles.radioCard : genStyles.checkCard}>
                  {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option) => (
                    <label key={option}>
                      <input
                        style={{ marginRight: "6px" }}
                        type={currentQuestion.type}
                        name={String(currentQuestion.multiple_choice)}
                        value={option}
                        checked={
                          currentQuestion.type === "radio"
                            ? form[currentQuestion.multiple_choice] === option
                            : ((form[currentQuestion.multiple_choice] as unknown as string[]) || []).includes(option)
                        }
                        onChange={() =>
                          currentQuestion.type === "radio"
                            ? updateField(currentQuestion.multiple_choice, option)
                            : toggleCheckbox(currentQuestion.multiple_choice, option, currentQuestion.max)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <div className={genStyles.free}>
                  <textarea
                    className={genStyles.draft}
                    rows={3}
                    value={(form[currentQuestion.free_text] as unknown as string) || ""}
                    onChange={(e) => updateField(currentQuestion.free_text, e.target.value)}
                    placeholder="위에 선택하신 내역에 대해 자신의 경험을 서술해 주세요 (필수)"
                    
                  />
                </div>
              </>
            )}
          </div>

        )}

        {step === totalSteps && (
          <>
            <h2 className={genStyles.question}>
              {totalSteps + 1}. 기존 자기소개서 초안이 있다면 여기에 입력해주세요. 이를 바탕으로 작성해드립니다.
            </h2>
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="자기소개서 초안을 입력하세요"
              className={genStyles.draft}
            />
          </>
        )}

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded hover:scale-105">
              이전
            </button>
          )}
          {(step) < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-bright text-white rounded ml-auto hover:scale-105"
            >
              다음
            </button>
          ) : (
            <button className={genStyles.btn} type="submit" disabled={disabled}>
              나만의 자기소개서/
              <br />
              가이드 작성하기
            </button>
          )}
        </div>
      </div>
    </form>
  );
}