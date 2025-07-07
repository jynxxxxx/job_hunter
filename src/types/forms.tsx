export type JobOptions = {
  [key: string]: string[] | Record<string, string[]>;
};

export interface Question<T> {
  type: "radio" | "checkbox" | "jobOptions"
  label: string;
  multiple_choice: keyof T;
  free_text: keyof T;
  options: string[] | JobOptions;
  max: number;
}

export interface GuideOutputProps {
  result: {
    core_keywords: string[];
    key_experiences: string[];
    applicant_character: string;
    outline: string[];
    review_from_interviewer: string[];
  };
}

export interface EssayOutputProps {
  essay: string,
  length: string,
}
