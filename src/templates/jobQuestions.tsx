export const jobQuestions = [
  {
    job_id: "1",
    // Group questions by Q1, Q2, Q3 for clarity and separation
    q1: [
      {
        type: "jobOptions",
        label: "내가 하고 싶은 자동차 생산 일은?",
        toggleField: "jobType_toggle",
        freeField: "jobType_free",
        options: {
          '직접 생산': {
            '완성차 생산 공정': ['프레스', '차체', '도장', '의장'],
            '파워트레인/시트 생산 공정': ['소재', '엔진·변속기 조립', '시트 (자동차 좌석 제작)']
          },
          '간접 생산': [
            '설비 관리 (장비 고장 예방·유지보수)',
            '생산 관리 (부품·자재 공급 및 일정 관리)',
            '품질 관리 (불량 탐지·품질 개선)'
          ],
        },
        max: 1,
      },
      {
        type: "checkbox",
        label: "내가 자동차 기술 일을 잘할 수 있다고 생각하는 이유는? (최대 2개)",
        toggleField: "skillReasons_toggle",
        freeField: "skillReasons_free",
        options: [
          "손재주가 좋고 기계 다루는 게 익숙하다",
          "작업 순서를 빠르게 익히고 반복 숙련에 강하다",
          "꼼꼼해서 실수를 줄이는 데 자신 있다",
          "문제 원인 찾고 개선하는 능력이 있다",
          "속도와 정확성을 동시에 유지할 수 있다",
          "안전 수칙을 철저히 준수하는 습관이 있다",
          "팀원과 소통하며 협업을 잘 한다",
          "새 장비·시스템 배우는 게 흥미롭다",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "미래 자동차는 어떤 모습이라 생각하나요? (최대 2개)",
        toggleField: "futureMobility_toggle",
        freeField: "futureMobility_free",
        options: [
          "전기차",
          "수소차",
          "자율주행차",
          "드론·로봇택시 (UAM 포함)",
          "차량 통신 시스템 (V2X)",
          "차량 내 AI 인포테인먼트 시스템",
          "친환경 재활용 소재 활용",
          "무인 물류·운송 시스템",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "나만의 특별한 강점 (최대 2개)",
        toggleField: "personalStrengths_toggle",
        freeField: "personalStrengths_free",
        options: [
          "불량 원인 빨리 찾는다",
          "실수를 예방하는 점검 습관이 있다",
          "위험 요소를 미리 파악한다",
          "반복 작업에도 집중력을 유지한다",
          "꼼꼼한 품질 체크 능력이 있다",
          "협업 분위기를 만드는 커뮤니케이션이 강하다",
          "변화·새로운 장비 적응력이 빠르다",
          "안전을 항상 최우선으로 생각한다",
          '기타'
        ],
        max: 2,
      },
    ],
    q2: [
      {
        type: "radio",
        label: "함께 일한 경험은?",
        toggleField: "workExperienceToggle",
        freeField: "workExperienceFree",
        options: [
          "아르바이트 (식당, 공장, 마트 등)",
          "학교 조별과제",
          "공장 실습 현장",
          "기능경기대회·학원 실습반",
          "졸업 작품·설계 프로젝트",
          '기타'
        ],
        max: 1,
      },
      {
        type: "checkbox",
        label: "어떤 문제가 생겼나요? (최대 2개)",
        toggleField: "problemsFacedToggle",
        freeField: "problemsFacedFree",
        options: [
          "의견 충돌이 있었다",
          "일정 지연이 발생했다",
          "역할 분담이 잘 안 됐다",
          "작업 실수가 반복됐다",
          "책임 회피가 있었다",
          "의사소통 부족했다",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "협업 과정에서 내가 맡은 역할은? (최대 2개)",
        toggleField: "myRolesToggle",
        freeField: "myRolesFree",
        options: [
          "일정 계획 세우고 조율했다",
          "갈등을 중재했다",
          "부족한 부분을 보완했다",
          "다른 사람 실수를 수습했다",
          "마무리 검사를 맡았다",
          "전체 진행 상황 관리했다",
          "작업 기록·정리·보고서 작성했다",
          "기술적 실무 조언 제공했다",
          '기타'
        ],
        max: 2,
      },
      {
        type: "radio",
        label: "결과는 어떻게 됐나요?",
        toggleField: "outcomeToggle",
        freeField: "outcomeFree",
        options: [
          "문제가 잘 해결됐다",
          "결과물이 좋아졌다",
          "일정 안에 마무리됐다",
          "서로 만족하며 마무리했다",
          '기타'
        ],
        max: 1,
      },
      {
        type: "checkbox",
        label: "내가 느낀 내 단점은? (최대 2개)",
        toggleField: "weaknessesToggle",
        freeField: "weaknessesFree",
        options: [
          "말하기가 어려웠다",
          "의견을 적극적으로 내지 못했다",
          "리더 역할이 부담스러웠다",
          "감정 조절이 어려웠다",
          "준비가 부족했다",
          "다른 사람 의견을 충분히 듣지 못했다",
          "고집을 조금 부렸다",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "이걸 극복하려고 어떻게 노력했나요? (최대 2개)",
        toggleField: "overcomeEffortsToggle",
        freeField: "overcomeEffortsFree",
        options: [
          "말하는 연습을 꾸준히 했다",
          "메모하며 의견 정리하는 습관을 들였다",
          "먼저 다가가 말을 걸어보았다",
          "리더 역할을 작게 시도했다",
          "적극 경청 연습을 했다",
          "실수 시 침착하게 대응하는 훈련을 했다",
          '기타'
        ],
        max: 2,
      },
    ],
    q3: [
      {
        type: "radio",
        label: "내가 스스로 세운 목표는?",
        toggleField: "goalToggle",
        freeField: "goalFree",
        options: [
          "자격증 따기 (기능사, 산업기사 등)",
          "캡스톤·설계 프로젝트 완수",
          "졸업 작품 완성하기",
          "실습 현장 평가 우수 받기",
          "시뮬레이션·CAD 프로그램 능력 키우기",
          "기능경기대회 준비하기",
          "복잡한 정비·조립 기술 배우기",
          '기타'
        ],
        max: 1,
      },
      {
        type: "checkbox",
        label: "이 목표를 왜 세웠나요? (최대 2개)",
        toggleField: "reasonsToggle",
        freeField: "reasonsFree",
        options: [
          "실무 기술 높이고 싶어서",
          "부족한 부분 보완하려고",
          "기술 변화 대비하려고",
          "경쟁력 있는 사람이 되고 싶어서",
          "공정 실습 중 흥미 생겨서",
          "차별화된 기술력을 만들고 싶어서",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "목표 달성 중 어려웠던 점은? (최대 2개)",
        toggleField: "difficultiesToggle",
        freeField: "difficultiesFree",
        options: [
          "작업 실수·불량 반복",
          "장비 셋팅·정밀도 맞추기 어려움",
          "공정 오차 맞추기 힘듦",
          "프로그램 (CAD 등) 사용 어려움",
          "품질 기준 유지 힘듦",
          "반복 숙련으로 체력 부담",
          "복잡한 공정 순서 외우기 어려움",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "이 어려움을 어떻게 해결했나요? (최대 2개)",
        toggleField: "solutionsToggle",
        freeField: "solutionsFree",
        options: [
          "선배·지도자에게 적극 피드백 받음",
          "공정별 체크리스트 만들어 점검",
          "반복 숙련으로 몸에 익힘",
          "불량 원인 분석표 작성",
          "시뮬레이션 프로그램 꾸준히 연습",
          "학원·영상강의로 부족한 부분 보완",
          "매일 작업기록 작성",
          "모의시험·실습으로 실전 감각 익힘",
          '기타'
        ],
        max: 2,
      },
      {
        type: "checkbox",
        label: "이 경험에서 배운 점은? (최대 2개)",
        toggleField: "lessonsToggle",
        freeField: "lessonsFree",
        options: [
          "준비 철저함이 불량률 줄인다",
          "문제 원인 빨리 찾는 게 중요하다",
          "현장 감각은 반복 숙련에서 나온다",
          "계획적 연습이 변화를 만든다",
          "디테일이 품질을 만든다",
          "꾸준함이 최고의 경쟁력이다",
          "선배·팀원 조언 활용이 중요하다",
          "현장 표준 지키는 습관이 중요하다",
          '기타'
        ],
        max: 2,
      },
    ],
    numQuestions: {
      q1: 4, // update to match actual number of Q1 questions
      q2: 6, // update to match actual number of Q2 questions
      q3: 5, // update to match actual number of Q3 questions
    },
    formType: "hyundai",
    defaultFormQ1: {
      jobType_free: null,
      jobType_toggle: null,
      skillReasons_free: null,
      skillReasons_toggle: [],
      futureMobility_free: null,
      futureMobility_toggle: [],
      personalStrengths_free: null,
      personalStrengths_toggle: [],
    },
    defaultFormQ2: {
      workExperienceFree: null,
      workExperienceToggle: null,
      problemsFacedFree: null,
      problemsFacedToggle: [],
      myRolesFree: null,
      myRolesToggle: [],
      outcomeFree: null,
      outcomeToggle: null,
      weaknessesFree: null,
      weaknessesToggle: [],
      overcomeEffortsFree: null,
      overcomeEffortsToggle: [],
    },
    defaultFormQ3: {
      goalFree: null,
      goalToggle: null,
      reasonsFree: null,
      reasonsToggle: [],
      difficultiesFree: null,
      difficultiesToggle: [],
      solutionsFree: null,
      solutionsToggle: [],
      lessonsFree: null,
      lessonsToggle: [],
    },
    question1: "자신이 '모빌리티 기술인력'이라고 생각하는 이유와 남들과 차별화된 본인만의 강점을 기술해 주십시오.",
    question2:"협업을 통해서 문제를 해결해본 경험과, 그 과정에서 느꼈던 본인 성격의 단점, 이를 극복하기 위한 노력을 말씀해주세요.",
    question3:"스스로 목표를 설정해서 달성해나가는 과정에서 겪은 어려움과 극복해낸 방법을 말씀해 주십시오."
  },
  {
  job_id: "2",
  q1: [
    {
      type: "radio",
      label: "내가 회사를 선택할 때 가장 중요하게 여기는 기준은?",
      multiple_choice: "1_choice",
      free_text: "1_free",
      options: [
        "기술력과 R&D 투자",
        "성장 가능성과 사업 안정성",
        "일 잘하는 기업문화",
        "직무 적합성과 커리어 성장",
        "친환경 경영 등 사회적 책임",
        "워라밸과 복지제도"
      ],
      max: 1
    },
    {
      type: "radio",
      label: "이 기준을 중요하게 여기는 이유는?",
      multiple_choice: "2_choice",
      free_text: "2_free",
      options: [
        "빠르게 배우고 성장하고 싶어서",
        "내 전공/관심을 살릴 수 있어서",
        "안정된 환경에서 커리어를 쌓고 싶어서",
        "사회에 의미 있는 일을 하고 싶어서",
        "기술로 세상에 기여하고 싶어서",
        "즐겁게 오래 일할 수 있는 회사를 원해서"
      ],
      max: 1
    },
    {
      type: "checkbox",
      label: "포스코스틸리온이 그 기준을 만족한다고 느낀 이유는?",
      multiple_choice: "3_choice",
      free_text: "3_free",
      options: [
        "친환경·스마트팩토리 분야에서 앞서가는 기업이라서",
        "고기능강판 기술력이 업계 최고 수준이라서",
        "철강 + 첨단소재 융합 분야로 확장 중이라서",
        "포스코그룹 계열의 안정성과 성장성",
        "자동화·디지털 전환 속도가 빠름",
        "신입교육 및 사내 교육이 잘 갖춰져 있어서"
      ],
      max: 2
    },
    {
      type: "radio",
      label: "내가 지원한 직무는?",
      multiple_choice: "4_choice",
      free_text: "4_free",
      options: [
        "생산기술 엔지니어",
        "설비기술 엔지니어",
        "품질관리",
        "공정개선 및 스마트팩토리 기획",
        "안전·환경관리",
        "R&D 연구직"
      ],
      max: 1
    },
    {
      type: "checkbox",
      label: "입사 후 이루고 싶은 나의 목표는?",
      multiple_choice: "5_choice",
      free_text: "5_free",
      options: [
        "현장 자동화 개선 프로젝트 주도",
        "설비 고장률 20% 줄이기",
        "품질 데이터 기반 문제예측 시스템 도입",
        "신기술 도입 시범라인 참여",
        "협업 문화를 이끄는 구성원 되기",
        "3년 내 사내 전문가 인증 취득"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "이 목표가 회사에 어떤 기여를 줄 수 있을까요?",
      multiple_choice: "6_choice",
      free_text: "6_free",
      options: [
        "생산 효율 향상",
        "품질 불량률 감소",
        "비용 절감 및 납기 안정화",
        "안전한 작업환경 조성",
        "조직 내 기술전파 및 분위기 활성화",
        "신제품/공정 전환 속도 향상"
      ],
      max: 2
    }
  ],
  q2: [
    {
      type: "radio",
      label: "내가 중요하게 여기는 가치관은 무엇인가요?",
      multiple_choice: "1_choice",
      free_text: "1_free",
      options: [
        "책임감과 주인의식",
        "배려와 협력",
        "창의적 문제 해결",
        "꾸준함과 성실함",
        "도전정신",
        "정직과 신뢰"
      ],
      max: 1
    },
    {
      type: "radio",
      label: "이 가치관을 중요하게 여기게 된 이유는?",
      multiple_choice: "2_choice",
      free_text: "2_free",
      options: [
        "혼자보다 함께가 더 강하다고 느껴서",
        "작은 행동이 큰 결과를 만든다고 생각해서",
        "현장에서 주도적인 태도가 중요하다고 느껴서",
        "문제를 새로운 시각으로 푸는 게 즐거워서",
        "성실한 사람이 결국 성과를 만든다고 믿어서",
        "함께 일하고 싶은 사람이 되고 싶어서"
      ],
      max: 1
    },
    {
      type: "radio",
      label: "어떤 상황에서 이 가치관을 실천했나요?",
      multiple_choice: "3_choice",
      free_text: "3_free",
      options: [
        "조별과제 중 마감 직전에 충돌 발생",
        "현장실습 중 장비 오류 발생",
        "공모전 아이디어 단계에서 갈등",
        "아르바이트 중 동료 무단결근",
        "동아리 행사 준비 중 의견 불일치",
        "졸업작품 발표 준비 도중 자료 손실"
      ],
      max: 1
    },
    {
      type: "checkbox",
      label: "그때 내가 맡은 역할은?",
      multiple_choice: "4_choice",
      free_text: "4_free",
      options: [
        "일정 계획 세우고 조율",
        "갈등 중재 및 분위기 조정",
        "다른 사람 실수 보완",
        "전체 진행 상황 관리",
        "마무리 검토 및 발표",
        "보고서 정리 및 발표 자료 제작"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "내가 한 구체적인 행동은?",
      multiple_choice: "5_choice",
      free_text: "5_free",
      options: [
        "우선순위 재정리로 일정 재구성",
        "팀원과 1:1 소통하며 이해도 맞춤",
        "실수 내용 파악 후 재작업 진행",
        "대체 자료 찾아서 새롭게 구성",
        "맡은 일 외에도 부족한 부분 메움",
        "중간 피드백 시간 마련해서 흐름 조정"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "그 결과는 어땠나요?",
      multiple_choice: "6_choice",
      free_text: "6_free",
      options: [
        "과제 마감일 내 완료",
        "결과물이 더 나아졌다고 평가받음",
        "팀워크가 좋아졌음",
        "상위 점수 획득",
        "담당 교수/실습 선생님 칭찬",
        "행사/과제 모두 성공적으로 마무리"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "이 가치관이 회사에 어떤 영향을 줄 수 있을까요?",
      multiple_choice: "7_choice",
      free_text: "7_free",
      options: [
        "업무 신뢰도를 높일 수 있음",
        "협업 효율을 높이고 갈등을 줄일 수 있음",
        "창의적인 방식으로 문제를 빠르게 해결할 수 있음",
        "반복되는 실수를 줄이고 표준화에 기여할 수 있음",
        "사내 분위기를 더 밝게 만들 수 있음"
      ],
      max: 2
    }
  ],
  q3: [
    {
      type: "radio",
      label: "내가 지원한 직무는?",
      multiple_choice: "1_choice",
      free_text: "1_free",
      options: [
        "생산기술 엔지니어",
        "설비기술 엔지니어",
        "품질관리",
        "스마트팩토리/데이터 분석",
        "공정개선",
        "R&D 연구직"
      ],
      max: 1
    },
    {
      type: "checkbox",
      label: "해당 직무의 주요 업무는?",
      multiple_choice: "2_choice",
      free_text: "2_free",
      options: [
        "생산공정 관리 및 개선",
        "설비 유지보수 및 예지정비",
        "품질 검사 및 불량 분석",
        "공정/장비 자동화 기획",
        "공정 데이터 수집 및 분석",
        "재료 테스트 및 품질 인증"
      ],
      max: 3
    },
    {
      type: "checkbox",
      label: "전공 또는 배운 내용 중 관련 있는 것은?",
      multiple_choice: "3_choice",
      free_text: "3_free",
      options: [
        "기계/전기/화학/신소재 전공",
        "회로이론, 제어공학, 재료역학",
        "품질관리(QC 7가지 도구 등)",
        "통계적 공정관리(SPC)",
        "데이터분석(Python, R, SQL 등)"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "직무 관련 프로젝트 또는 경험은?",
      multiple_choice: "4_choice",
      free_text: "4_free",
      options: [
        "설비 개선 아이디어 제안 프로젝트",
        "품질 이상치 탐지 실습",
        "공정 레이아웃 개선 실습",
        "자동화 라인 설계 경험",
        "인턴 중 현장 품질 점검",
        "팀프로젝트로 제조 공정 시뮬레이션"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "보유 자격증 또는 기술 역량은?",
      multiple_choice: "5_choice",
      free_text: "5_free",
      options: [
        "전기/기계/화학 관련 기사 자격증",
        "품질경영기사",
        "CAD / PLC / LabView 등 소프트웨어",
        "Python, SQL, 엑셀 통계분석 가능",
        "안전 관련 자격증 (산업안전기사 등)"
      ],
      max: 2
    },
    {
      type: "checkbox",
      label: "내가 이 직무를 잘할 수 있다고 생각하는 이유는?",
      multiple_choice: "6_choice",
      free_text: "6_free",
      options: [
        "꼼꼼하고 체계적인 성격",
        "문제를 차분히 분석하는 습관",
        "팀워크에 강하고 피드백에 유연함",
        "책임감 있게 일 처리함",
        "기술 배우는 걸 즐김",
        "현장 경험이 있어 실무에 빠르게 적응 가능"
      ],
      max: 2
    }
  ],
  numQuestions: {
    q1: 6,
    q2: 7,
    q3: 6
  },
  question1: "포스코스틸리온을 선택한 이유와 입사 후 이루고 싶은 목표에 대해 구체적으로 기술하여 주십시오. (800자)",
  question2: "본인이 가장 중요하게 생각하는 가치관은 무엇이며, 해당 가치관이 조직 내에서 어떻게 긍정적인 영향을 미칠 수 있는지 본인의 경험을 바탕으로 구체적으로 기술하여 주십시오. (800자)",
  question3:"지원하신 직무의 역할과 주요 업무에 대해 이해하고 있는 바를 설명해 주시고, 해당 직무를 잘 수행할 수 있다고 생각하는 이유를 본인의 경험과 역량을 바탕으로 구체적으로 기술하여 주십시오. (800자)"
  }
];

// Helper to get template for a company/job
export function getQuestionTemplate(job_id: string) {
  return jobQuestions.find(t => t.job_id == job_id);
}
