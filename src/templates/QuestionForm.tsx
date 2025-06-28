'use client'

import React, { useState, useEffect } from "react";
import hdStyles from "@/styles/hyundai.module.scss";
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
    console.log("Form data updated:", form);
  }, [form]);

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
          <div className={hdStyles.stepGroup}>
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
            <div className={hdStyles.stepGroup}>
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
            <div className={hdStyles.stepGroup}>
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
            <div className={hdStyles.stepGroup}>
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
      className={hdStyles.formctn} 
      onSubmit={e => {
        if (!submitEnabled) {
          e.preventDefault();
          return;
        }
        onSubmit(e);
      }}
    >
      <div className="text-lg font-bold text-center">
        문항 별로 작성 후 하단 &apos;나만의 자기소개서/가이드 작성하기&apos;<br />
        클릭 부탁드립니다.
      </div>
      <div className="flex gap-[1rem] items-center justify-center text-gray-500 pb-[0.5rem] w-[90%] mx-auto">
        <div className="text-xl">※</div>
        <div className="text-center">개인의 경험을 최대한 자세하게 작성해 주세요.</div>
        <div className="text-xl">※</div>
      </div>

      <div className="w-[80%] bg-gray-200 h-2 rounded mb-4 mx-auto">
        <div
          className=" h-full bg-bright rounded transition-all duration-300"
          style={{ width: `${((step + 1) / (totalSteps+1)) * 100}%` }}
        />
      </div>

      <div className={hdStyles.leftSide}>
        {step < totalSteps && currentQuestion && (
          <div>
            <h2 className={hdStyles.question}>{step +1}. {currentQuestion.label}</h2>
            {currentQuestion.type === "jobOptions"
              ? renderJobOptions()
              : (
              <>
                <div className={currentQuestion.type === "radio" ? hdStyles.radioCard : hdStyles.checkCard}>
                  {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option) => (
                    <label key={option}>
                      <input
                        style={{ marginRight: "6px" }}
                        type={currentQuestion.type}
                        name={String(currentQuestion.toggleField)}
                        value={option}
                        checked={
                          currentQuestion.type === "radio"
                            ? form[currentQuestion.toggleField] === option
                            : ((form[currentQuestion.toggleField] as unknown as string[]) || []).includes(option)
                        }
                        onChange={() =>
                          currentQuestion.type === "radio"
                            ? updateField(currentQuestion.toggleField, option)
                            : toggleCheckbox(currentQuestion.toggleField, option, currentQuestion.max)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <div className={hdStyles.free}>
                  <textarea
                    className={hdStyles.draft}
                    rows={3}
                    value={(form[currentQuestion.freeField] as unknown as string) || ""}
                    onChange={(e) => updateField(currentQuestion.freeField, e.target.value)}
                    placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
                  />
                </div>
              </>
            )}
          </div>

        )}

        {step === totalSteps && (
          <>
            <h2 className={hdStyles.question}>
              {totalSteps + 1}. 기존 자기소개서 초안이 있다면 여기에 입력해주세요. 이를 바탕으로 작성해드립니다.
            </h2>
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="자기소개서 초안을 입력하세요"
              className={hdStyles.draft}
            />
          </>
        )}

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">
              이전
            </button>
          )}
          {(step) < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
            >
              다음
            </button>
          ) : (
            <button className={hdStyles.btn} type="submit" disabled={disabled}>
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