import React, { useState } from "react";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import hdStyles from "@/styles/hyundai.module.scss";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { generateOutline } from "@/app/api/generate";

type JobTypeFree = string;
type JobTypeToggle = string;
type SkillReasonFree = string;
type SkillReasonToggle = string;
type FutureMobilityFree = string;
type FutureMobilityToggle = string;
type PersonalStrengthFree = string;
type PersonalStrengthToggle = string;

interface MobilityForm {
  jobTypeFree: JobTypeFree | null;
  jobTypeToggle: JobTypeToggle | null;
  skillReasonsFree: SkillReasonFree | null;
  skillReasonsToggle: SkillReasonToggle[];
  futureMobilityFree: FutureMobilityFree | null;
  futureMobilityToggle: FutureMobilityToggle[];
  personalStrengthsFree: PersonalStrengthFree | null;
  personalStrengthsToggle: PersonalStrengthToggle[];
}

const MAX = {
  skills: 2,
  future: 2,
  strengths: 2,
};

const jobOptions = {
  '직접 생산': {
    '완성차 생산 공정': ['프레스', '차체', '도장', '의장'],
    '파워트레인/시트 생산 공정': ['소재', '엔진·변속기 조립', '시트 (자동차 좌석 제작)']
  },
  '간접 생산': [
    '설비 관리 (장비 고장 예방·유지보수)',
    '생산 관리 (부품·자재 공급 및 일정 관리)',
    '품질 관리 (불량 탐지·품질 개선)'
  ],
};

const skillOptions: SkillReasonToggle[] = [
  "손재주가 좋고 기계 다루는 게 익숙하다",
  "작업 순서를 빠르게 익히고 반복 숙련에 강하다",
  "꼼꼼해서 실수를 줄이는 데 자신 있다",
  "문제 원인 찾고 개선하는 능력이 있다",
  "속도와 정확성을 동시에 유지할 수 있다",
  "안전 수칙을 철저히 준수하는 습관이 있다",
  "팀원과 소통하며 협업을 잘 한다",
  "새 장비·시스템 배우는 게 흥미롭다",
  '기타'
];

const futureOptions: FutureMobilityToggle[] = [
  "전기차",
  "수소차",
  "자율주행차",
  "드론·로봇택시 (UAM 포함)",
  "차량 통신 시스템 (V2X)",
  "차량 내 AI 인포테인먼트 시스템",
  "친환경 재활용 소재 활용",
  "무인 물류·운송 시스템",
  '기타'
];

const strengthOptions: PersonalStrengthToggle[] = [
  "불량 원인 빨리 찾는다",
  "실수를 예방하는 점검 습관이 있다",
  "위험 요소를 미리 파악한다",
  "반복 작업에도 집중력을 유지한다",
  "꼼꼼한 품질 체크 능력이 있다",
  "협업 분위기를 만드는 커뮤니케이션이 강하다",
  "변화·새로운 장비 적응력이 빠르다",
  "안전을 항상 최우선으로 생각한다",
  '기타'
];

const defaultForm: MobilityForm = {
  jobTypeFree: null,
  jobTypeToggle: null,
  skillReasonsFree: null,
  skillReasonsToggle: [],
  futureMobilityFree: null,
  futureMobilityToggle: [],
  personalStrengthsFree: null,
  personalStrengthsToggle: [],
};

const Hyundai_Q1 = ({ setAnswer, waiting, setWaiting }: { setAnswer: (answer: any ) => void,  waiting: boolean, setWaiting: (waiting: boolean) => void }) => {
  const { authUser } = useAuth()
  const [form, setForm] = useState<MobilityForm>(defaultForm);
  const [draft, setDraft] = useState("")
  const [jobLevel1, setJobLevel1] = useState<string | null>(null);
  const [jobLevel2, setJobLevel2] = useState<string | null>(null);
  const [jobLevel3, setJobLevel3] = useState<string | null>(null);

  // Checkbox toggle with max limit and 기타 handling
  const handleCheckbox = (field: keyof MobilityForm, value: string, max: number) => {
    const current = form[field] as string[];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter((v) => v !== value) });
    } else {
      if (current.length >= max) return;
      setForm({ ...form, [field]: [...current, value] });
    }
  }
 
  const handleFreeForm = (field: keyof MobilityForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalJobType = null

    if (jobLevel3 !== ""){
      finalJobType = jobLevel3
    } else if (jobLevel2 !== ""){
      finalJobType = jobLevel2
    } else if (jobLevel1 !== ""){
      finalJobType = jobLevel1
    } else ( finalJobType = "" )

    if (
      !finalJobType||
      (form.skillReasonsToggle.length === 0) || 
      (!form.skillReasonsFree) ||
      (form.futureMobilityToggle.length === 0) || 
      (!form.futureMobilityFree) ||
      (form.personalStrengthsToggle.length === 0) || 
      (!form.personalStrengthsFree)
    ) {
      toast.error("모든 필수 항목을 입력하거나 선택해주세요.");
      setWaiting(false);
      return;
    }

    setWaiting(true)
    document.getElementById("top")?.scrollIntoView()

    let hasPaid
    let genCount
    if (!authUser) {
      toast.error("로그인이 필요합니다."); // "Login required."
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      genCount = userDoc.exists() && userDoc.data().generation_count
      hasPaid = userDoc.exists() && userDoc.data().hasPaid === true;
    } catch {
      toast.error("사용자 정보를 불러오는 중 오류가 발생했습니다.")
    }

    if (genCount > 2 && !hasPaid) {
      toast.error("무료 이용 횟수(3회)를 모두 사용하셨습니다. 더 많은 자소서를 원하신다면 결제를 진행해주세요.")
      return;
    }

    const data = {
      ...form,
      jobTypeFree:"없음",
      jobTypeToggle: [finalJobType],
      draft: draft
    }

    const sanitizedData = {
      question_id: 1,
      jobType_free: data.jobTypeFree,
      jobType_toggle: data.jobTypeToggle ,
      skillReasons_free: data.skillReasonsFree, 
      skillReasons_toggle: data.skillReasonsToggle, 
      futureMobility_free: data.futureMobilityFree, 
      futureMobility_toggle: data.futureMobilityToggle, 
      personalStrengths_free: data.personalStrengthsFree, 
      personalStrengths_toggle: data.personalStrengthsToggle, 
      draft: data.draft || ""
    };
    // console.log("sending data", sanitizedData)
   

    try {
      const result = await generateOutline(sanitizedData)
      setAnswer(result)
      await addDoc(
        collection(db, 'users', authUser.uid, 'generations'),
        {
          createdAt: serverTimestamp(),
          input: sanitizedData,
          result: result.result
        }
      );
      const userRef = doc(db, 'users', authUser.uid);
      await updateDoc(userRef, {
        generation_count: increment(1)
      });
    } catch (e: any) {
      console.error("생성 횟수 업데이트에 실패했습니다.", e.message);
    } finally {
      setWaiting(false)
    }
  }

  // useEffect(() => {
  //   console.log("Form data updated:", form);
  // }, [form]);

  return (
    <form className={hdStyles.formctn} onSubmit={handleUpload}>
      <div className='flex gap-[1rem] items-center text-gray-500 pb-[0.5rem] w-[90%] mx-auto'>
        <div className='text-xl'>※</div> 
        <div className='text-center'>개인의 경험을 최대한 자세하게 작성해 주세요.</div>
        <div className='text-xl'>※</div>
      </div>   
      <div className={hdStyles.leftSide}>  
        {/* 1. jobType (radio with 기타 input) */}
        <h2 className={hdStyles.question}>1. 내가 하고 싶은 자동차 생산 일은?</h2>
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr] pt-[1rem] pb-[2rem] ml-[1.5rem]">
          <div className={hdStyles.stepGroup}>
            {Object.keys(jobOptions).map((job) => (
              <div key={job}>
                <label>
                  <input
                    style={{marginRight: "6px"}}
                    type="radio"
                    name="job"
                    value={job}
                    checked={jobLevel1 === job}
                    onChange={() => {
                      setJobLevel1(job)
                      setJobLevel2("")
                    }}
                  />
                  {job}
                </label>
              </div>
            ))}
          </div>
          {/* <div className={hdStyles.free}>
            <textarea
              className={hdStyles.draft}
              rows={3}
              value={ form.jobTypeFree || "" }
              onChange={(e) => handleFreeForm("jobTypeFree", e.target.value)}
                          placeholder="기타 항목이나 추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
            required
            />
          </div> */}

          {jobLevel1 && (
            Array.isArray(jobOptions[jobLevel1 as keyof typeof jobOptions]) ? (
              <div className={hdStyles.stepGroup}>
                {(jobOptions[jobLevel1 as keyof typeof jobOptions] as string[]).map((job2) => (
                  <label key={job2}>
                    <input
                      type="radio"
                      name="step2"
                      value={job2}
                      checked={jobLevel2 === job2}
                      onChange={() => {
                        setJobLevel2(job2)
                        setJobLevel3("")
                      }}
                      style={{ marginRight: '6px' }}
                    />
                    {job2}
                  </label>
                ))}
              </div>
            ) : (
              <div className={hdStyles.stepGroup}>
                {Object.keys(jobOptions[jobLevel1 as keyof typeof jobOptions] as Record<string, any>).map((job2) => (
                  <label key={job2}>
                    <input
                      type="radio"
                      name="step2"
                      value={job2}
                      checked={jobLevel2 === job2}
                      onChange={() => {
                        setJobLevel2(job2)
                        setJobLevel3("")
                      }}
                      style={{ marginRight: '6px' }}
                    />
                    {job2}
                  </label>
                ))}
              </div>
            )
          )}  



          {jobLevel1 && jobLevel2 && (
            !Array.isArray(jobOptions[jobLevel1 as keyof typeof jobOptions]) &&
            Array.isArray(
              (jobOptions[jobLevel1 as keyof typeof jobOptions] as Record<string, string[]>)[jobLevel2]
            ) && (
              <div className={hdStyles.stepGroup}>
                {(jobOptions[jobLevel1 as keyof typeof jobOptions] as Record<string, string[]>)[jobLevel2].map((job3) => (
                  <label key={job3}>
                    <input
                      type="radio"
                      name="step3"
                      value={job3}
                      checked={jobLevel3 === job3}
                      onChange={() => setJobLevel3(job3)}
                      style={{ marginRight: '6px' }}
                    />
                    {job3}
                  </label>
                ))}
              </div>
            )
          )}
        </div>

        {/* 2. skillReasons (checkbox with 기타 input) */}
        <h2 className={hdStyles.question}>
          2. 내가 자동차 기술 일을 잘할 수 있다고 생각하는 이유는? (최대 2개)
        </h2>
        <div className={hdStyles.checkCard}>
          {skillOptions.map((skill) => (
            <div key={skill}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  value={skill}
                  checked={form.skillReasonsToggle.includes(skill)}
                  onChange={() => handleCheckbox("skillReasonsToggle", skill, MAX.skills)}
                />
                {skill}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.skillReasonsFree || "" }
            onChange={(e) => handleFreeForm("skillReasonsFree", e.target.value)}
            placeholder="기타 항목이나 추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        {/* 3. futureMobility (checkbox with 기타 input) */}
        <h2 className={hdStyles.question}>3. 미래 자동차는 어떤 모습이라 생각하나요? (최대 2개)</h2>
        <div className={hdStyles.checkCard}>
          {futureOptions.map((mobility) => (
            <div key={mobility}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  value={mobility}
                  checked={form.futureMobilityToggle.includes(mobility)}
                  onChange={() => handleCheckbox("futureMobilityToggle", mobility, MAX.future)}
                />
                {mobility}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.futureMobilityFree || "" }
            onChange={(e) => handleFreeForm("futureMobilityFree", e.target.value)}
            placeholder="기타 항목이나 추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        {/* 4. personalStrengths (checkbox with 기타 input) */}
        <h2 className={hdStyles.question}>4. 나만의 특별한 강점 (최대 2개)</h2>
        <div className={hdStyles.checkCard}>
          {strengthOptions.map((strength) => (
            <div key={strength}>
              <label>
                <input
                  style={{marginRight: "6px"}}
                  type="checkbox"
                  value={strength}
                  checked={form.personalStrengthsToggle.includes(strength)}
                  onChange={() =>
                    handleCheckbox("personalStrengthsToggle", strength, MAX.strengths)
                  }
                />
                {strength}
              </label>
            </div>
          ))}
        </div>
        <div className={hdStyles.free}>
          <textarea
            className={hdStyles.draft}
            rows={3}
            value={ form.personalStrengthsFree || "" }
            onChange={(e) => handleFreeForm("personalStrengthsFree", e.target.value)}
            placeholder="기타 항목이나 추가 하고 싶은 자신의 경험에 대해 자유롭게 써주세요."
          />
        </div>

        <h2 className={hdStyles.question}>5. 기존 자소서 초안이 있다면 여기에 입력해주세요. 이를 바탕으로 작성해드립니다.</h2>
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
          <button 
            className={hdStyles.btn} 
            type="submit" 
            disabled={waiting}
          >
            나만의 가이드 생성하기
          </button>
        </div>
      </div>
    </form>
  );
};

export default Hyundai_Q1;
