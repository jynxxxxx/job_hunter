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
  guideline: {
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

export type SectionKey = 
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10";

export type SectionCounts = Partial<Record<SectionKey, number>>;

export interface Feedback {
  feedback: string[]
  additional_info_request: {
    needs_additional_info: boolean,
    reason: string,
    questions: string[]
  }
}

export interface Revision {
  revised_essay: string,
  revision_explanation: string[]
}

export interface SubQuestionItem {
  sub_question: string;
  suggested_inputs: string[];
}

export interface SubQuestionGroup {
  question: string;
  sub_question_list: {
    [key: string]: SubQuestionItem;
  };
}

export interface SubQuestions {
  subquestion: {
    [key: string]: SubQuestionGroup;
  };
  prompts: Record<string, Record<string, string>>;
}

export interface FeedbackCategory {
  점수: number;
  설명: string;
  피드백: string;
};

export interface FeedbackDict {
  항목별_평가: {
    질문_적합도: FeedbackCategory;
    경험_연결력: FeedbackCategory;
    직무_키워드_반영: FeedbackCategory;
    표현력과_문장력: FeedbackCategory;
    개성과_차별성: FeedbackCategory;
  };
  총괄_피드백: string;
};

export interface EvaluateResponse {
  final_score: number;
  feedback_dict: FeedbackDict;
};

export interface PersonaResponse {
  persona_feedback: string;
};
