export type JobOptions = {
  [key: string]: string[] | Record<string, string[]>;
};

export interface Question<T> {
  type: "radio" | "checkbox" | "jobOptions"
  label: string;
  toggleField: keyof T;
  freeField: keyof T;
  options: string[] | JobOptions;
  max: number;
}

export interface HyundaiGuideOutputProps {
  result: {
    core_keywords: string[];
    key_experiences: string[];
    applicant_character: string;
    outline: string[];
    review_from_interviewer: string[];
  };
}

export interface HyundaiEssayOutputProps {
  essay: string,
  length: string,
}
