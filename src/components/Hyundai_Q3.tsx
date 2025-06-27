import React, { useState } from "react";
import hdStyles from "@/styles/hyundai.module.scss";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useUserData } from "@/context/UserDataContext";

type GoalFree = string;
type GoalToggle = string;
type ReasonFree = string;
type ReasonToggle = string;
type DifficultyFree = string;
type DifficultyToggle = string;
type SolutionFree = string;
type SolutionToggle = string;
type LessonFree = string;
type LessonToggle = string;

interface Question3Form {
  goalFree: GoalFree | null;
  goalToggle: GoalToggle | null;
  reasonsFree: ReasonFree | null;
  reasonsToggle: ReasonToggle[];
  difficultiesFree: DifficultyFree | null;
  difficultiesToggle: DifficultyToggle[];
  solutionsFree: SolutionFree | null;
  solutionsToggle: SolutionToggle[];
  lessonsFree: LessonFree | null;
  lessonsToggle: LessonToggle[];
}

const MAX = {
  reasons: 2,
  difficulties: 3,
  solutions: 3,
  lessons: 3,
};

const goalOptions: GoalToggle[] = [
  "자격증 따기 (기능사, 산업기사 등)",
  "캡스톤·설계 프로젝트 완수",
  "졸업 작품 완성하기",
  "실습 현장 평가 우수 받기",
  "시뮬레이션·CAD 프로그램 능력 키우기",
  "기능경기대회 준비하기",
  "복잡한 정비·조립 기술 배우기",
];

const reasonOptions: ReasonToggle[] = [
  "실무 기술 높이고 싶어서",
  "부족한 부분 보완하려고",
  "기술 변화 대비하려고",
  "경쟁력 있는 사람이 되고 싶어서",
  "공정 실습 중 흥미 생겨서",
  "차별화된 기술력을 만들고 싶어서",
];

const difficultyOptions: DifficultyToggle[] = [
  "작업 실수·불량 반복",
  "장비 셋팅·정밀도 맞추기 어려움",
  "공정 오차 맞추기 힘듦",
  "프로그램 (CAD 등) 사용 어려움",
  "품질 기준 유지 힘듦",
  "반복 숙련으로 체력 부담",
  "복잡한 공정 순서 외우기 어려움",
];

const solutionOptions: SolutionToggle[] = [
  "선배·지도자에게 적극 피드백 받음",
  "공정별 체크리스트 만들어 점검",
  "반복 숙련으로 몸에 익힘",
  "불량 원인 분석표 작성",
  "시뮬레이션 프로그램 꾸준히 연습",
  "학원·영상강의로 부족한 부분 보완",
  "매일 작업기록 작성",
  "모의시험·실습으로 실전 감각 익힘",
];

const lessonOptions: LessonToggle[] = [
  "준비 철저함이 불량률 줄인다",
  "문제 원인 빨리 찾는 게 중요하다",
  "현장 감각은 반복 숙련에서 나온다",
  "계획적 연습이 변화를 만든다",
  "디테일이 품질을 만든다",
  "꾸준함이 최고의 경쟁력이다",
  "선배·팀원 조언 활용이 중요하다",
  "현장 표준 지키는 습관이 중요하다",
];

const defaultForm: Question3Form = {
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
};


interface HyundaiOutputProps {
  result: {
    core_keywords: string[];
    key_experiences: string[];
    applicant_character: string;
    outline: string[];
    review_from_interviewer: string[];
  };
}

const Hyundai_Q3 = ({ setAnswer, waiting, setWaiting }: { setAnswer: (answer: HyundaiOutputProps | null) => void,  waiting: boolean, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const { userData}  = useUserData()
  const [form, setForm] = useState<Question3Form>(defaultForm);
  const [draft, setDraft] = useState("")

  const handleCheckbox = (field: keyof Question3Form, value: string, max: number) => {
    const current = form[field] as string[];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter((v) => v !== value) });
    } else {
      if (current.length >= max) return;
      setForm({ ...form, [field]: [...current, value] });
    }
  }

  const handleFreeForm = (field: keyof Question3Form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleUpload = async() => {
    document.getElementById("top")?.scrollIntoView()
    let hasPaid

    if (!authUser) {
      toast.error("로그인이 필요합니다."); // "Login required."
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      hasPaid = userDoc.exists() && userDoc.data().hasPaid === true;
    } catch {
      toast.error("사용자 정보를 불러오는 중 오류가 발생했습니다.")
    }

    if (!hasPaid) {
      toast.error("접근이 제한되었습니다. 이 콘텐츠를 이용하시려면 결제가 필요합니다.");
      return;
    }
    
    setWaiting(true)
    // const data = {
    //   ...form,
    //   draft: draft
    // }

    
    setTimeout(() => {
      // setAnswer(`Q3 ${JSON.stringify(data)}`)
      setAnswer(null)
      setWaiting(false)
    }, 3000)
  }

  // useEffect(() => {
  //   console.log("Form data updated:", form);
  // }, [form]);

  return (
    <form className={hdStyles.formctn}>
      <div className='flex gap-[1rem] items-center text-gray-500 pb-[0.5rem] w-[90%] mx-auto'>
        <div className='text-xl'>※</div> 
        <div className='text-center'>자신의 경험을 기입하는 것은 필수는 아닙니다. 하지만, 자신의 경험과 생각을 자세히 서술하면 합격률이 최대 3배까지 올라갑니다.</div>
        <div className='text-xl'>※</div>
      </div>   
      <div className={hdStyles.leftSide}>  
        <h2 className={hdStyles.question}>1. 내가 스스로 세운 목표는?</h2>
        <div className={hdStyles.radioCard}>
          {goalOptions.map((goal) => (
            <div key={goal}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="radio"
                  name="goal"
                  value={goal}
                  checked={form.goalToggle === goal}
                  onChange={(e) => handleFreeForm('goalToggle', e.target.value)}
                />
                {goal}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.goalFree || "" }
            onChange={(e) => handleFreeForm("goalFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>2. 이 목표를 왜 세웠나요? (최대 2개)</h2>
        <div className={hdStyles.checkCard}>
          {reasonOptions.map((reason) => (
            <div key={reason}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.reasonsToggle.includes(reason)}
                  onChange={() => handleCheckbox("reasonsToggle", reason, MAX.reasons)}
                />
                {reason}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.reasonsFree || "" }
            onChange={(e) => handleFreeForm("reasonsFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>3. 목표 달성 중 어려웠던 점은? (최대 3개)</h2>
        <div className={hdStyles.checkCard}>
          {difficultyOptions.map((diff) => (
            <div key={diff}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.difficultiesToggle.includes(diff)}
                  onChange={() =>
                    handleCheckbox("difficultiesToggle", diff, MAX.difficulties)
                  }
                />
                {diff}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.difficultiesFree || "" }
            onChange={(e) => handleFreeForm("difficultiesFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>4. 이 어려움을 어떻게 해결했나요? (최대 3개)</h2>
        <div className={hdStyles.checkCard}>
          {solutionOptions.map((sol) => (
            <div key={sol}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.solutionsToggle.includes(sol)}
                  onChange={() =>
                    handleCheckbox("solutionsToggle", sol, MAX.solutions)
                  }
                />
                {sol}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.solutionsFree || "" }
            onChange={(e) => handleFreeForm("solutionsFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>
          
        <h2 className={hdStyles.question}>5. 이 경험에서 배운 점은? (최대 3개)</h2>
        <div className={hdStyles.checkCard}>
          {lessonOptions.map((lesson) => (
            <div key={lesson}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.lessonsToggle.includes(lesson)}
                  onChange={() => handleCheckbox("lessonsToggle", lesson, MAX.lessons)}
                />
                {lesson}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.lessonsFree || "" }
            onChange={(e) => handleFreeForm("lessonsFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>6. 기존 자소서 초안이 있다면 여기에 입력해주세요. 이를 바탕으로 작성해드립니다.</h2>
        <div >
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="자소서 초안을 입력하세요"
            className={hdStyles.draft}
          />
        </div>

        <div className={hdStyles.btnctn}>
          <button className={hdStyles.btn} type="button" onClick={handleUpload} disabled={waiting || !userData?.hasPaid}>
            나만의 자기소개서 생성하기
          </button>
        </div>
      </div>
    </form>
  );
};

export default Hyundai_Q3;
