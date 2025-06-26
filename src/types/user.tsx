export interface ParsedResume {
  이름?: {
    성?: string;
    이름?: string;
  };
  연락처?: {
    이메일?: string;
    전화번호?: string;
    주소?: string;
  };
  요약?: string;
  학력?: Array<{
    학교명?: string;
    전공?: string;
    학위?: string;
    졸업년도?: string;
    GPA?: string;
    상세내용?: string;
  }>;
  경력?: Array<{
    회사명?: string;
    직책?: string;
    근무기간?: string;
    상세내용?: string;
  }>;
  스킬셋?: string[];
  프로젝트?: any[]; // Define more specifically if needed
  논문및출판?: any[];
  자격증?: any[];
  외부활동및수상?: any[];
  기타?: string;
}

export interface CustomUserProfile {
  name?: string; // e.g., fullName, or parsed name
  email?: string;
  phoneNumber?: string;
  // ... any other general user profile fields you store directly in the main document

  // Fields for the CURRENTLY ACTIVE resume (cached for quick access)
  parsedResumeData?: ParsedResume;   // The structured data from your API for the active resume
  resumeStorageUrl?: string;  // URL to the active resume's PDF in Firebase Storage
  resumeUploadDate?:  string; 
  hasPaid?: boolean;
  generation_count?: number;
}