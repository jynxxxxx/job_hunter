'use client'

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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
  setLastStep: (lastStep: boolean) => void;
}

export interface QuestionFormRef {
  nextStep: () => void;
  submitForm: () => void;
  resetForm: () => void;
}

function QuestionFormComponent<T>(
  {
    questions,
    form,
    setForm,
    draft,
    setDraft,
    onSubmit,
    jobLevel1,
    setJobLevel1,
    jobLevel2,
    setJobLevel2,
    jobLevel3,
    setJobLevel3,
    setLastStep
  }: QuestionFormProps<T>,
  ref: React.Ref<QuestionFormRef>
) {
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [step, setStep] = useState(0);
  const totalSteps = questions.length;
  const currentQuestion = questions[step];
  const nextQuestionRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    nextStep() {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
        setTimeout(() => {
          nextQuestionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      if (step == (totalSteps - 1)) {setLastStep(true)}

    },
    submitForm() {
      if (step === totalSteps && submitEnabled) {
        // Create a synthetic event with preventDefault no-op
        const syntheticEvent = {
          preventDefault: () => {},
        } as React.FormEvent;

        onSubmit(syntheticEvent);
      } else {
        // Optionally handle disabled submit case
        console.log('Submit is disabled');
      }
    },
    resetForm() {
      setStep(0);
      setDraft("");
      setForm({} as T);
    }
  }));

  useEffect(() => {
    if (step === totalSteps) {
      setSubmitEnabled(false);
      const timer = setTimeout(() => {
        setSubmitEnabled(true);
      }, 100); // 1 milliseconds delay

      return () => clearTimeout(timer);
    } else {
      setSubmitEnabled(false); // disable when not last step
    }
  }, [step, totalSteps])

  useEffect(() => {
    if (!nextQuestionRef.current || step === 0) return;

    const element = nextQuestionRef.current;

    // Delay is necessary to allow layout/render to finish
    const timeout = setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementCenter = rect.top + scrollY + rect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const scrollTo = elementCenter - screenCenter;

      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }, 100); // Delay matters!

    return () => clearTimeout(timeout);
  }, [step]);
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
            className=" h-full bg-primary rounded transition-all duration-300"
            style={{ width: `${((step + 1) / (totalSteps+1)) * 100}%` }}
          />
        </div>
      </div>

      <div className={genStyles.questionCtn}>
        {questions.slice(0, step + 1).map((question, index) => {
          const isLast = index === step;
          return (
            <div key={index}  ref={isLast ? nextQuestionRef : null} className={`transition-opacity duration-500 ease-in-out ${genStyles.fadeIn}`}>
              <h2 className={genStyles.question}>{index + 1}. {question.label} (최대 {question.max}개)</h2>
              {question.type === "jobOptions" ? (
                renderJobOptions()
              ) : (
                <>
                  <div className={question.type === "radio" ? genStyles.radioCard : genStyles.checkCard}>
                    {Array.isArray(question.options) && question.options.map((option) => (
                      <label key={option}>
                        <input
                          style={{ marginRight: "6px" }}
                          type={question.type}
                          name={String(question.multiple_choice)}
                          value={option}
                          checked={
                            question.type === "radio"
                              ? form[question.multiple_choice] === option
                              : ((form[question.multiple_choice] as unknown as string[]) || []).includes(option)
                          }
                          onChange={() =>
                            question.type === "radio"
                              ? updateField(question.multiple_choice, option)
                              : toggleCheckbox(question.multiple_choice, option, question.max)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <div className={`transition-opacity duration-500 ease-in-out ${genStyles.fadeIn} ${genStyles.free}`}>
                    <textarea
                      className={genStyles.draft}
                      rows={3}
                      value={(form[question.free_text] as unknown as string) || ""}
                      onChange={(e) => updateField(question.free_text, e.target.value)}
                      placeholder="위 선택하신 내역에 대한 이유 및 자신의 경험을 서술해 주세요. (필수)"
                    />
                  </div>
                </>
              )}
            </div>
          )
        })}

        {step === totalSteps && (
          <div ref={step === totalSteps ? nextQuestionRef : null} className="transition-opacity duration-500 ease-in-out animate-fadeIn">
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
          </div>
        )}
      </div>
    </form>
  );
}

const QuestionForm = forwardRef(QuestionFormComponent) as <T>(
  props: QuestionFormProps<T> & { ref?: React.Ref<QuestionFormRef> }
) => React.ReactElement;

export default QuestionForm;