import React, { useState } from "react";
import hdStyles from "@/styles/hyundai.module.scss";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useUserData } from "@/context/UserDataContext";

type WorkExperienceFree = string;
type WorkExperienceToggle = string;
type ProblemTypeFree = string;
type ProblemTypeToggle = string;
type RoleInTeamFree = string;
type RoleInTeamToggle = string;
type OutcomeFree = string;
type OutcomeToggle = string;
type PersonalWeaknessFree = string;
type PersonalWeaknessToggle = string;
type OvercomeEffortFree = string;
type OvercomeEffortToggle = string;

interface CollaborationForm {
  workExperienceFree: WorkExperienceFree | null;
  workExperienceToggle: WorkExperienceToggle | null;
  problemsFacedFree: ProblemTypeFree | null;
  problemsFacedToggle: ProblemTypeToggle[];
  myRolesFree: RoleInTeamFree | null;
  myRolesToggle: RoleInTeamToggle[];
  outcomeFree: OutcomeFree | null;
  outcomeToggle: OutcomeToggle | null;
  weaknessesFree: PersonalWeaknessFree | null;
  weaknessesToggle: PersonalWeaknessToggle[];
  overcomeEffortsFree: OvercomeEffortFree | null;
  overcomeEffortsToggle: OvercomeEffortToggle[];
}

const MAX = {
  problems: 3,
  roles: 3,
  weaknesses: 2,
  efforts: 2,
};

const workOptions: WorkExperienceToggle[] = [
  "아르바이트 (식당, 공장, 마트 등)",
  "학교 조별과제",
  "공장 실습 현장",
  "기능경기대회·학원 실습반",
  "졸업 작품·설계 프로젝트"
];

const problemOptions: ProblemTypeToggle[] = [
  "의견 충돌이 있었다",
  "일정 지연이 발생했다",
  "역할 분담이 잘 안 됐다",
  "작업 실수가 반복됐다",
  "책임 회피가 있었다",
  "의사소통 부족했다"
];

const roleOptions: RoleInTeamToggle[] = [
  "일정 계획 세우고 조율했다",
  "갈등을 중재했다",
  "부족한 부분을 보완했다",
  "다른 사람 실수를 수습했다",
  "마무리 검사를 맡았다",
  "전체 진행 상황 관리했다",
  "작업 기록·정리·보고서 작성했다",
  "기술적 실무 조언 제공했다"
];

const outcomeOptions: OutcomeToggle[] = [
  "문제가 잘 해결됐다",
  "결과물이 좋아졌다",
  "일정 안에 마무리됐다",
  "서로 만족하며 마무리했다"
];

const weaknessOptions: PersonalWeaknessToggle[] = [
  "말하기가 어려웠다",
  "의견을 적극적으로 내지 못했다",
  "리더 역할이 부담스러웠다",
  "감정 조절이 어려웠다",
  "준비가 부족했다",
  "다른 사람 의견을 충분히 듣지 못했다",
  "고집을 조금 부렸다"
];

const effortOptions: OvercomeEffortToggle[] = [
  "말하는 연습을 꾸준히 했다",
  "메모하며 의견 정리하는 습관을 들였다",
  "먼저 다가가 말을 걸어보았다",
  "리더 역할을 작게 시도했다",
  "적극 경청 연습을 했다",
  "실수 시 침착하게 대응하는 훈련을 했다"
];

const defaultForm: CollaborationForm = {
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

const Hyundai_Q2 = ({ setAnswer, waiting, setWaiting }: { setAnswer: (answer: HyundaiOutputProps | null) => void,  waiting: boolean, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const { userData}  = useUserData()
  const [form, setForm] = useState<CollaborationForm>(defaultForm);
  const [draft, setDraft] = useState("")

  // Checkbox toggle with max limit and 기타 handling
  const handleCheckbox = (field: keyof CollaborationForm, value: string, max: number) => {
    const current = form[field] as string[];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter((v) => v !== value) });
    } else {
      if (current.length >= max) return;
      setForm({ ...form, [field]: [...current, value] });
    }
  }
 
  const handleFreeForm = (field: keyof CollaborationForm, value: string) => {
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
      // setAnswer(`Q2 ${JSON.stringify(data)}`)|
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
        <div className='text-center'>개인의 경험을 최대한 자세하게 작성해 주세요.</div>
        <div className='text-xl'>※</div>
      </div>   
      <div className={hdStyles.leftSide}>  
        <h2 className={hdStyles.question}>1. 함께 일한 경험은?</h2>
        <div className={hdStyles.radioCard}>
          {workOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="radio"
                  name="workExperienceToggle"
                  value={item}
                  checked={ form.workExperienceToggle === item }
                  onChange={(e) => handleFreeForm("workExperienceToggle", e.target.value)}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.workExperienceFree || "" }
            onChange={(e) => handleFreeForm("workExperienceFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>2. 어떤 문제가 생겼나요? (최대 3개)</h2>
        <div className={hdStyles.checkCard}>
          {problemOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.problemsFacedToggle.includes(item)}
                  onChange={() =>
                    handleCheckbox("problemsFacedToggle", item, MAX.problems)
                  }
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.problemsFacedFree || "" }
            onChange={(e) => handleFreeForm("problemsFacedFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>3. 협업 과정에서 내가 맡은 역할은? (최대 3개)</h2>
        <div className={hdStyles.checkCard}>
          {roleOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.myRolesToggle.includes(item)}
                  onChange={() => handleCheckbox("myRolesToggle", item, MAX.roles)}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.myRolesFree || "" }
            onChange={(e) => handleFreeForm("myRolesFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>4. 결과는 어떻게 됐나요?</h2>
        <div className={hdStyles.radioCard}>
          {outcomeOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="radio"
                  name="outcome"
                  value={item}
                  checked={ form.outcomeToggle === item }
                  onChange={(e) => handleFreeForm("outcomeToggle", e.target.value)}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.outcomeFree || "" }
            onChange={(e) => handleFreeForm("outcomeFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>5. 내가 느낀 내 단점은? (최대 2개)</h2>
        <div className={hdStyles.checkCard}>
          {weaknessOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.weaknessesToggle.includes(item)}
                  onChange={() =>
                    handleCheckbox("weaknessesToggle", item, MAX.weaknesses)
                  }
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.weaknessesFree || "" }
            onChange={(e) => handleFreeForm("weaknessesFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>6. 이걸 극복하려고 어떻게 노력했나요? (최대 2개)</h2>
        <div className={hdStyles.checkCard}>
          {effortOptions.map((item) => (
            <div key={item}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  checked={form.overcomeEffortsToggle.includes(item)}
                  onChange={() =>
                    handleCheckbox("overcomeEffortsToggle", item, MAX.efforts)
                  }
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.overcomeEffortsFree || "" }
            onChange={(e) => handleFreeForm("overcomeEffortsFree", e.target.value)}
            placeholder="추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>7. 기존 자소서 초안이 있다면 여기에 입력해주세요. 이를 바탕으로 작성해드립니다.</h2>
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

export default Hyundai_Q2;
