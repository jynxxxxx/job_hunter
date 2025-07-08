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
    "job_id": "2",
    "q1": [
      {
        "type": "checkbox",
        "label": "회사를 선택할 때 가장 중요하게 여기는 기준은 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "성장 가능성",
          "기업 문화",
          "직무 적합성",
          "기술 혁신",
          "사회적 기여",
          "안정성",
          "글로벌 진출",
          "환경 지속 가능성",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "선택한 기준을 왜 중요하게 생각하나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "개인의 성장과 발전을 위해",
          "일과 삶의 균형을 위해",
          "사회에 긍정적인 영향을 미치기 위해",
          "최신 기술을 배우고 활용하기 위해",
          "안정적인 직업을 위해",
          "글로벌 경험을 쌓기 위해",
          "환경 보호에 기여하기 위해",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온이 해당 기준을 어떻게 충족하나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "지속적인 기술 혁신과 연구 개발",
          "협력적이고 포용적인 기업 문화",
          "글로벌 시장에서의 강력한 입지",
          "사회적 책임을 강조하는 경영 철학",
          "친환경 생산 공정 도입",
          "직원 교육 및 개발 프로그램",
          "안정적인 재무 상태",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "입사 후 이루고 싶은 목표는 무엇인가요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "생산 공정의 효율성 향상",
          "혁신적인 설비 개발",
          "글로벌 프로젝트 참여",
          "지속 가능한 생산 방식 도입",
          "팀 리더로 성장",
          "기술 전문가로서 인정받기",
          "회사의 사회적 책임 프로젝트 기여",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온에 어떻게 기여할 수 있나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "최신 기술을 활용한 생산 공정 개선",
          "팀 협업을 통한 문제 해결",
          "지속 가능한 설비 설계",
          "글로벌 프로젝트에서의 리더십 발휘",
          "혁신적인 아이디어 제안",
          "고객 만족도 향상",
          "효율적인 자원 관리",
          "기타"
        ],
        "max": 2
      }
    ],
    "q2": [
      {
        "type": "checkbox",
        "label": "가장 중요하게 생각하는 가치관은 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "실천",
          "배려",
          "창의",
          "정직",
          "책임감",
          "협력",
          "열정",
          "혁신",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 가치관을 선택한 이유는 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "문제 해결에 필수적이어서",
          "팀워크를 강화하기 위해",
          "개인의 성장을 위해",
          "조직의 목표 달성을 위해",
          "신뢰를 구축하기 위해",
          "새로운 아이디어 창출을 위해",
          "긍정적인 조직 문화를 위해",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 가치관을 실천한 경험은 무엇인가요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "팀 프로젝트에서 갈등 해결",
          "자원봉사 활동",
          "창의적인 문제 해결 사례",
          "정직한 피드백 제공",
          "책임 있는 프로젝트 리더십",
          "협력적 업무 수행",
          "열정적인 목표 추구",
          "혁신적인 아이디어 제안",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "그 경험에서 맡은 역할은 무엇인가요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "팀 리더",
          "조정자",
          "아이디어 제안자",
          "피드백 제공자",
          "문제 해결자",
          "지원자",
          "혁신 촉진자",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "결과는 어떻게 되었나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "팀의 목표 달성",
          "프로젝트 성공",
          "긍정적인 팀 분위기 조성",
          "고객 만족도 향상",
          "혁신적인 솔루션 도출",
          "개인의 성장과 발전",
          "조직 내 신뢰 구축",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 가치관이 조직 내에서 어떤 긍정적인 영향을 미칠 수 있나요?",
        "multiple_choice": "6_choice",
        "free_text": "6_free",
        "options": [
          "협력적인 팀워크 강화",
          "창의적인 문제 해결 촉진",
          "신뢰와 존중의 문화 조성",
          "지속 가능한 성과 달성",
          "혁신적인 조직 발전",
          "긍정적인 업무 환경 조성",
          "조직 목표 달성 가속화",
          "기타"
        ],
        "max": 2
      }
    ],
    "q3": [
      {
        "type": "checkbox",
        "label": "지원 직무의 역할과 주요 업무는 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "생산 공정 관리",
          "설비 유지보수",
          "품질 관리",
          "기술적 문제 해결",
          "설비 개선 및 최적화",
          "안전 관리",
          "데이터 분석 및 보고",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "해당 직무를 잘 수행할 수 있는 이유는 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "관련 전공 지식 보유",
          "실무 경험",
          "문제 해결 능력",
          "팀 협업 능력",
          "기술적 역량",
          "분석적 사고",
          "지속적인 학습 의지",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "관련 경험은 무엇인가요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "인턴십 경험",
          "관련 프로젝트 수행",
          "연구 및 실험 경험",
          "팀 프로젝트 경험",
          "자격증 취득",
          "기술 워크숍 참여",
          "생산 현장 실습",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "그 경험에서 어떤 성과를 이루었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "생산 효율성 향상",
          "설비 고장 감소",
          "품질 개선",
          "비용 절감",
          "프로젝트 성공적 완료",
          "팀 목표 달성",
          "기술 혁신",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온에서 어떤 가치를 창출할 수 있나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "생산 공정의 혁신",
          "설비의 효율적 관리",
          "품질 향상",
          "안전한 작업 환경 조성",
          "비용 절감 및 수익 증대",
          "지속 가능한 생산 방식 도입",
          "기술적 리더십 발휘",
          "기타"
        ],
        "max": 2
      }
    ],
    "numQuestions": {
      "q1": 5,
      "q2": 6,
      "q3": 5
    },
    "question1": "포스코스틸리온을 선택한 이유와 입사 후 이루고 싶은 목표에 대해 구체적으로 기술하여 주십시오. (800자)",
    "question2": "본인이 가장 중요하게 생각하는 가치관은 무엇이며, 해당 가치관이 조직 내에서 어떻게 긍정적인 영향을 미칠 수 있는지 본인의 경험을 바탕으로 구체적으로 기술하여 주십시오. (800자)",
    "question3": "지원하신 직무의 역할과 주요 업무에 대해 이해하고 있는 바를 설명해 주시고, 해당 직무를 잘 수행할 수 있다고 생각하는 이유를 본인의 경험과 역량을 바탕으로 구체적으로 기술하여 주십시오. (800자)"
  },
  {
    "job_id": "3",
    "q1": [
      {
        "type": "checkbox",
        "label": "회사를 선택할 때 가장 중요하게 여기는 기준은 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "성장 가능성",
          "기업 문화",
          "직무 적합성",
          "기술 혁신",
          "사회적 기여",
          "안정성",
          "글로벌 진출 가능성",
          "환경 지속 가능성",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "해당 기준을 선택한 이유는 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "개인의 성장과 발전을 위해",
          "직무에 대한 열정과 흥미",
          "혁신적인 기술을 배우고 싶어서",
          "사회에 긍정적인 영향을 미치고 싶어서",
          "안정적인 직장을 원해서",
          "국제적인 경험을 쌓고 싶어서",
          "환경 보호에 기여하고 싶어서",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온이 해당 기준을 어떻게 충족하나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "지속적인 기술 혁신을 통해",
          "직원 중심의 기업 문화를 통해",
          "다양한 사회공헌 활동을 통해",
          "글로벌 시장에서의 입지를 통해",
          "환경 친화적인 경영 방침을 통해",
          "안정적인 재무 구조를 통해",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "입사 후 이루고 싶은 목표는 무엇인가요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "품질 혁신을 주도하고 싶다",
          "팀의 성과를 극대화하고 싶다",
          "새로운 기술을 개발하고 싶다",
          "회사의 글로벌 확장에 기여하고 싶다",
          "지속 가능한 경영에 기여하고 싶다",
          "고객 만족도를 높이고 싶다",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온에 어떻게 기여할 수 있나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "품질 개선 프로젝트를 통해",
          "팀워크와 협업을 통해",
          "혁신적인 아이디어를 제안하여",
          "글로벌 프로젝트에 참여하여",
          "환경 친화적인 솔루션을 제안하여",
          "고객 피드백을 적극 반영하여",
          "기타"
        ],
        "max": 2
      }
    ],
    "q2": [
      {
        "type": "checkbox",
        "label": "가장 중요하게 생각하는 가치관은 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "실천",
          "배려",
          "창의",
          "정직",
          "협력",
          "책임감",
          "열정",
          "도전",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "해당 가치관을 선택한 이유는 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "목표를 달성하기 위해",
          "팀의 화합을 위해",
          "문제 해결을 위해",
          "신뢰를 쌓기 위해",
          "공동의 목표를 위해",
          "맡은 바를 완수하기 위해",
          "열정을 유지하기 위해",
          "새로운 것을 시도하기 위해",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 가치관을 실천했던 경험은 무엇인가요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "프로젝트 리더로서 팀을 이끌었다",
          "팀원 간의 갈등을 해결했다",
          "새로운 아이디어를 제안했다",
          "정직하게 문제를 보고했다",
          "협력하여 목표를 달성했다",
          "책임을 다하여 업무를 완수했다",
          "열정을 가지고 프로젝트에 임했다",
          "도전적인 목표를 설정했다",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "그 경험에서 배운 점은 무엇인가요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "실천이 결과를 만든다",
          "배려가 팀을 강하게 만든다",
          "창의가 혁신을 이끈다",
          "정직이 신뢰를 만든다",
          "협력이 성과를 낸다",
          "책임감이 신뢰를 만든다",
          "열정이 동기를 부여한다",
          "도전이 성장을 이끈다",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 가치관이 조직 내에서 어떻게 긍정적인 영향을 미칠 수 있나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "실천을 통해 목표 달성에 기여할 수 있다",
          "배려를 통해 팀워크를 강화할 수 있다",
          "창의를 통해 혁신을 촉진할 수 있다",
          "정직을 통해 신뢰를 구축할 수 있다",
          "협력을 통해 성과를 극대화할 수 있다",
          "책임감을 통해 신뢰를 강화할 수 있다",
          "열정을 통해 동기 부여를 할 수 있다",
          "도전을 통해 성장을 촉진할 수 있다",
          "기타"
        ],
        "max": 2
      }
    ],
    "q3": [
      {
        "type": "checkbox",
        "label": "지원 직무의 역할은 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "품질 관리",
          "품질 보증",
          "품질 개선",
          "고객 요구 사항 분석",
          "품질 검사 및 테스트",
          "품질 문제 해결",
          "품질 데이터 분석",
          "품질 교육 및 훈련",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "주요 업무는 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "품질 기준 설정 및 유지",
          "품질 검사 및 테스트 수행",
          "품질 문제 분석 및 해결",
          "고객 요구 사항 수집 및 분석",
          "품질 개선 프로젝트 주도",
          "품질 데이터 수집 및 분석",
          "품질 관련 교육 및 훈련 제공",
          "품질 관련 보고서 작성",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "해당 직무를 잘 수행할 수 있는 이유는 무엇인가요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "관련 전공 지식 보유",
          "품질 관리 경험",
          "문제 해결 능력",
          "데이터 분석 능력",
          "고객 중심 사고",
          "팀워크 및 협업 능력",
          "커뮤니케이션 능력",
          "지속적인 학습 의지",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "본인의 경험은 무엇인가요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "품질 관리 프로젝트 참여",
          "인턴십에서 품질 보증 업무 수행",
          "팀 프로젝트에서 품질 개선 주도",
          "고객 요구 사항 분석 경험",
          "품질 검사 및 테스트 경험",
          "품질 문제 해결 경험",
          "데이터 분석 프로젝트 참여",
          "품질 관련 교육 및 훈련 제공 경험",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "포스코스틸리온에서 어떤 가치를 창출할 수 있나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "품질 혁신을 통해 고객 만족도 향상",
          "품질 개선을 통해 비용 절감",
          "데이터 분석을 통해 품질 문제 예측 및 예방",
          "고객 요구 사항을 반영한 품질 개선",
          "팀워크를 통한 품질 문제 해결",
          "지속적인 학습을 통한 품질 역량 강화",
          "커뮤니케이션을 통한 품질 정보 공유",
          "품질 교육을 통한 조직 역량 강화",
          "기타"
        ],
        "max": 2
      }
    ],
    "numQuestions": {
      "q1": 5,
      "q2": 5,
      "q3": 5
    },
    "question1": "포스코스틸리온을 선택한 이유와 입사 후 이루고 싶은 목표에 대해 구체적으로 기술하여 주십시오. (800자)",
    "question2": "본인이 가장 중요하게 생각하는 가치관은 무엇이며, 해당 가치관이 조직 내에서 어떻게 긍정적인 영향을 미칠 수 있는지 본인의 경험을 바탕으로 구체적으로 기술하여 주십시오. (800자)",
    "question3": "지원하신 직무의 역할과 주요 업무에 대해 이해하고 있는 바를 설명해 주시고, 해당 직무를 잘 수행할 수 있다고 생각하는 이유를 본인의 경험과 역량을 바탕으로 구체적으로 기술하여 주십시오. (800자)"
  },
  {
    "job_id": "11",
    "q직무 경험 기술": [
      {
        "type": "checkbox",
        "label": "어떤 경험을 선택하셨나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "대학 프로젝트",
          "인턴십 경험",
          "연구 논문 작성",
          "공모전 참여",
          "학습 활동 (온라인 강의, 워크숍 등)",
          "자격증 취득 과정",
          "동아리 활동",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험에서 맡은 역할은 무엇이었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "팀 리더",
          "데이터 분석가",
          "기술 개발자",
          "품질 검사원",
          "보고서 작성자",
          "문제 해결자",
          "커뮤니케이터",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "사용한 기술이나 도구는 무엇인가요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "Python",
          "R",
          "Minitab",
          "JMP",
          "C/C++",
          "MATLAB",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "직면했던 문제점은 무엇이었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "기술적 한계",
          "데이터 부족",
          "팀원 간 의견 차이",
          "시간 부족",
          "자원 부족",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "문제 해결을 위해 어떤 노력을 기울였나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "새로운 알고리즘 개발",
          "데이터 수집 및 분석",
          "팀원과의 협력 강화",
          "외부 전문가의 조언 수렴",
          "지속적인 테스트 및 피드백",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "결과로 얻은 성과는 무엇인가요?",
        "multiple_choice": "6_choice",
        "free_text": "6_free",
        "options": [
          "불량률 감소",
          "제품 성능 향상",
          "프로젝트 성공적 완료",
          "고객 만족도 증가",
          "논문 출판",
          "기타"
        ],
        "max": 2
      }
    ],
    "q1": [
      {
        "type": "checkbox",
        "label": "어떤 전문성을 키우기 위해 노력했나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "제품 인증 평가 기준",
          "양산품질 모니터링",
          "불량 분석",
          "공정 변경 관리",
          "고객 불량 개선 대책",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 학습 과정을 거쳤나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "관련 전공 학습",
          "품질 관련 자격증 취득",
          "데이터 분석 툴 학습",
          "품질 관련 이론 스터디",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "실전에서 어떻게 적용했나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "프로젝트 참여",
          "실험 수행",
          "인턴십 경험",
          "논문 작성",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 성과를 이루었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "불량률 감소",
          "공정 개선",
          "제품 신뢰성 향상",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "문제 해결 능력 향상",
          "데이터 분석 능력 강화",
          "협업의 중요성",
          "기타"
        ],
        "max": 2
      }
    ],
    "q2": [
      {
        "type": "checkbox",
        "label": "어떤 상황에서 팀워크를 발휘했나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "신제품 인증 과정",
          "고객 불만 해결",
          "프로젝트 협업",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "팀원 간의 갈등이나 문제는 무엇이었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "의견 불일치",
          "정보 공유 부족",
          "역할 분담 문제",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "본인이 취한 주도적인 행동은 무엇이었나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "갈등 조율",
          "정보 공유 촉진",
          "협력 유도",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "팀워크의 결과는 무엇이었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "품질 문제 조기 해결",
          "고객 만족도 향상",
          "프로젝트 성공적 완료",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "협업의 중요성",
          "효과적인 소통 방법",
          "문제 해결 능력",
          "기타"
        ],
        "max": 2
      }
    ],
    "q3": [
      {
        "type": "checkbox",
        "label": "어떤 도전적인 목표를 세웠나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "불량률 감소",
          "새로운 품질 검증 방법론 도입",
          "복합 불량 원인 규명",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "목표 달성 과정에서 어떤 어려움을 겪었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "기술적 한계",
          "데이터 부족",
          "기존 방식의 제약",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어려움을 극복하기 위해 어떤 노력을 했나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "독창적인 해결책 모색",
          "지속적인 테스트",
          "협력 강화",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "목표 달성의 결과는 무엇이었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "불량률 개선",
          "시스템 성공적 도입",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "끈기와 인내의 중요성",
          "문제 해결 능력 강화",
          "기타"
        ],
        "max": 2
      }
    ],
    "q#": [
      {
        "type": "checkbox",
        "label": "본인을 나타내는 해시태그는 무엇인가요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "#데이터분석전문가",
          "#문제해결사",
          "#협업촉진자",
          "#품질수호자",
          "#끈기있는분석가",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "선택한 해시태그와 관련된 구체적인 경험은 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "프로젝트 성공 사례",
          "문제 해결 경험",
          "협업 사례",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "본인의 가치관은 어떻게 형성되었나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "교육 경험",
          "직장 경험",
          "개인적 경험",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 상황에서 그 강점이 발휘되었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "팀 프로젝트",
          "개인 연구",
          "고객 대응",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "책임감의 중요성",
          "지속적인 학습의 필요성",
          "기타"
        ],
        "max": 2
      }
    ],
    "numQuestions": {
      "직무 경험 기술": 6,
      "q1": 5,
      "q2": 5,
      "q3": 5,
      "q#": 5
    },
    "question직무 경험 기술": "지원 분야 및 직무 역량과 관련된 프로젝트/공모전/논문/연구/학습/활동/경험 등을 작성해주세요. (1,000 자)",
    "question1": "지원하신 직무 분야의 전문성을 키우기 위해 꾸준히 노력한 경험에 대해 서술해주세요. (600자)",
    "question2": "팀워크를 발휘해 사람들을 연결하고 공동 목표 달성에 기여한 경험에 대해 서술해 주세요. (600자)",
    "question3": "도전적인 목표를 세우고 성취하기 위해 끈질기게 노력한 경험에 대해 서술해 주세요. (600자)",
    "question#": "지원자님은 어떤 사람인가요? (600자, 해시태그 최대 2개)"
  },
  {
    "job_id": "12",
    "q직무 경험 기술": [
      {
        "type": "checkbox",
        "label": "어떤 프로젝트나 경험을 선택하셨나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "유틸리티 설비 설계 프로젝트",
          "에너지 효율화 연구",
          "수자원 관리 개선 프로젝트",
          "환경 오염 물질 저감 활동",
          "화학물질 안전 관리 프로젝트",
          "IoT/AI 기반 설비 관리 시스템 개발",
          "공정 안전 개선 프로젝트",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 문제가 있었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "설비 효율이 낮았다",
          "에너지 소비가 과다했다",
          "수자원 낭비가 심각했다",
          "유해물질 배출이 많았다",
          "안전 규정 미준수 사례가 있었다",
          "데이터 분석이 부족했다",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "문제 해결을 위해 어떤 분석 방법을 사용했나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "데이터 분석 툴 활용 (Python, R 등)",
          "시뮬레이션 툴 활용 (CAD, CFD 등)",
          "현장 실사 및 인터뷰",
          "IoT 센서 데이터 활용",
          "머신러닝 모델 개발",
          "환경 및 안전 규제 검토",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 개선안을 도출하고 적용했나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "설비 구조 개선",
          "에너지 관리 시스템 도입",
          "수자원 재활용 시스템 구축",
          "유해물질 저감 장치 설치",
          "안전 관리 프로세스 강화",
          "AI 기반 예측 시스템 도입",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "결과는 어떻게 되었나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "에너지 소비량 XX% 절감",
          "수자원 재활용률 YY% 향상",
          "유해물질 배출량 ZZ% 감소",
          "안전 사고 발생률 감소",
          "설비 운영 효율 XX% 향상",
          "비용 절감 XX%",
          "기타"
        ],
        "max": 2
      }
    ],
    "q1": [
      {
        "type": "checkbox",
        "label": "어떤 전문성을 키우기 위해 노력했나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "에너지 관리 시스템",
          "수처리 공정 최적화",
          "화학물질 안전 관리",
          "스마트 팩토리 유틸리티 연동 기술",
          "공조/배기 시스템 관리",
          "전기/배관 시스템 설계",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 학습 과정을 거쳤나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "관련 전공 학습 (기계공학, 화학공학 등)",
          "관련 자격증 취득 (에너지관리기사 등)",
          "시뮬레이션 툴 학습 (CAD, CFD 등)",
          "데이터 분석 툴 학습 (Python, R 등)",
          "산업 현장 실습",
          "온라인 강의 수강",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "습득한 지식과 기술을 어떻게 적용했나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "프로젝트에서 에너지 효율 개선",
          "실험실에서 수처리 공정 최적화",
          "인턴십에서 화학물질 안전 관리",
          "유틸리티 시스템 개선 프로젝트 참여",
          "데이터 분석을 통한 문제 해결",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 성과를 얻었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "유틸리티 효율 XX% 개선",
          "비용 절감 XX%",
          "환경 오염물질 저감 XX%",
          "안전성 향상",
          "프로젝트 성공적 완료",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "전문성의 중요성",
          "지속적인 학습의 필요성",
          "실전 적용의 가치",
          "협업의 중요성",
          "문제 해결 능력 향상",
          "기타"
        ],
        "max": 2
      }
    ],
    "q2": [
      {
        "type": "checkbox",
        "label": "어떤 상황에서 팀워크를 발휘했나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "복잡한 설비 문제 해결",
          "신규 설비 도입",
          "환경 안전 목표 달성",
          "프로젝트 팀 구성",
          "부서 간 협력 필요",
          "외부 이해관계자와의 협업",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "팀원 간의 어떤 갈등이나 의견 차이가 있었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "목표 설정 차이",
          "역할 분담 문제",
          "의사소통 부족",
          "기술적 접근 방법 차이",
          "시간 관리 문제",
          "책임 회피",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "본인은 어떤 주도적인 행동을 했나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "갈등 조율 및 중재",
          "정보 공유 및 소통 강화",
          "협력 방안 제시",
          "팀원 동기 부여",
          "프로젝트 진행 상황 관리",
          "외부 협력업체와의 조율",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "결과적으로 어떤 성과를 달성했나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "공정 효율 향상",
          "안전 개선",
          "환경 목표 달성",
          "프로젝트 성공적 완료",
          "팀원 만족도 향상",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "협업의 중요성",
          "효과적인 소통 방법",
          "팀워크의 가치",
          "다양한 의견 수렴의 필요성",
          "리더십 역량 강화",
          "기타"
        ],
        "max": 2
      }
    ],
    "q3": [
      {
        "type": "checkbox",
        "label": "어떤 도전적인 목표를 세웠나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "최첨단 Fab 건설 과정에서의 유틸리티 시스템 설계",
          "기존 설비의 에너지 효율 개선",
          "유해물질 처리 문제 해결",
          "새로운 기술 도입",
          "환경 규제 준수 강화",
          "안전성 향상 목표",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "목표 달성 과정에서 어떤 어려움이 있었나요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "기술적 한계",
          "데이터 부족",
          "기존 방식의 제약",
          "안전/환경 규제 준수 난관",
          "예산 제한",
          "팀원 간 의견 차이",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이를 극복하기 위해 어떤 노력을 기울였나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "독창적인 해결책 모색",
          "끈질긴 연구와 실험",
          "다양한 방법 시도",
          "외부 전문가와의 협력",
          "지속적인 학습과 개선",
          "팀원과의 협력 강화",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "결과적으로 어떤 성과를 얻었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "에너지 효율 XX% 개선",
          "새로운 시스템 성공적 도입",
          "환경 목표 달성",
          "안전성 향상",
          "프로젝트 성공적 완료",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "도전의 가치",
          "끈기의 중요성",
          "문제 해결 능력 향상",
          "목표 설정의 중요성",
          "지속적인 개선의 필요성",
          "기타"
        ],
        "max": 2
      }
    ],
    "q#": [
      {
        "type": "checkbox",
        "label": "어떤 해시태그를 선택하셨나요?",
        "multiple_choice": "1_choice",
        "free_text": "1_free",
        "options": [
          "#유틸리티마스터",
          "#안전지킴이",
          "#환경수호자",
          "#효율성추구자",
          "#문제해결분석가",
          "#시스템설계자",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "선택한 해시태그와 관련된 경험은 무엇인가요?",
        "multiple_choice": "2_choice",
        "free_text": "2_free",
        "options": [
          "설비 운영 및 관리 경험",
          "에너지 절감 프로젝트 참여",
          "환경 보호 활동",
          "문제 해결 프로젝트",
          "시스템 설계 및 개선 경험",
          "안전 관리 활동",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "본인의 가치관은 어떻게 형성되었나요?",
        "multiple_choice": "3_choice",
        "free_text": "3_free",
        "options": [
          "학습과 경험을 통한 형성",
          "프로젝트 참여를 통한 성장",
          "협업을 통한 가치관 강화",
          "실패와 성공을 통한 교훈",
          "지속적인 개선을 통한 발전",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "어떤 상황에서 그 강점이 발휘되었나요?",
        "multiple_choice": "4_choice",
        "free_text": "4_free",
        "options": [
          "프로젝트 리더로서의 역할",
          "문제 해결 과정에서의 기여",
          "팀워크를 통한 목표 달성",
          "안전 및 환경 관리 강화",
          "시스템 설계 및 개선",
          "기타"
        ],
        "max": 2
      },
      {
        "type": "checkbox",
        "label": "이 경험을 통해 무엇을 배웠나요?",
        "multiple_choice": "5_choice",
        "free_text": "5_free",
        "options": [
          "본인의 강점과 개성",
          "협업과 소통의 중요성",
          "책임감과 성실성",
          "지속적인 학습의 필요성",
          "문제 해결 능력 강화",
          "기타"
        ],
        "max": 2
      }
    ],
    "numQuestions": {
      "직무 경험 기술": 5,
      "q1": 5,
      "q2": 5,
      "q3": 5,
      "q#": 5
    },
    "question직무 경험 기술": "지원 분야 및 직무 역량과 관련된 프로젝트/공모전/논문/연구/학습/활동/경험 등을 작성해주세요. (1,000 자)",
    "question1": "지원하신 직무 분야의 전문성을 키우기 위해 꾸준히 노력한 경험에 대해 서술해주세요. (600자)",
    "question2": "팀워크를 발휘해 사람들을 연결하고 공동 목표 달성에 기여한 경험에 대해 서술해 주세요. (600자)",
    "question3": "도전적인 목표를 세우고 성취하기 위해 끈질기게 노력한 경험에 대해 서술해 주세요. (600자)",
    "question#": "지원자님은 어떤 사람인가요? (600자, 해시태그 최대 2개)"
  }
];

// Helper to get template for a company/job
export function getQuestionTemplate(job_id: string) {
  return jobQuestions.find(t => t.job_id == job_id);
}
