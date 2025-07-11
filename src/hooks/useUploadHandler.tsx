import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { generateEssay, generateOutline } from "@/app/api/generate";
import { EssayOutputProps, GuideOutputProps } from "@/types/forms";

interface UploadParams<T> {
  form: T;
  draft: string;
  job_id: string;
  authUser: any;
  userData: any;
  freePassUsed: boolean;
  setWaiting: (b: boolean) => void;
  setRunning: (b: boolean) => void; // Optional prop to indicate if generation is running
  setEssay: (essay: any) => void;
  setGuide: (guide: any) => void;
  question_id: number | string;
  requiredFields: (keyof T)[];
}

export async function handleUpload<T>({
  form,
  draft,
  job_id,
  userData,
  authUser,
  freePassUsed,
  setWaiting,
  setRunning,
  setEssay,
  setGuide,
  question_id,
  requiredFields,
}: UploadParams<T>) {
  // Check all required fields: for toggles (arrays or string) and free text (string)
  for (const field of requiredFields) {
    const val = form[field];
    if (
      val === null ||
      val === undefined ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === "string" && val.trim() === "")
    ) {
      toast.error("모든 필수 항목을 입력하거나 선택해주세요.");
      setWaiting(false);
      return;
    }
  }

  if (!authUser || !userData) {
    toast.error("로그인이 필요합니다.");
    setWaiting(false);
    return;
  }

  setWaiting(true);
  const el = document.getElementById("top");
  if (el) {
    setTimeout(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 50);
  }

  try {
    const userRef = doc(db, "users", authUser.uid);
    const userSnap = await getDoc(userRef);

    const hasPaidMap = userSnap.exists() ? userSnap.data().hasPaid || {} : {};

    const jobId = String(job_id);
    const jobHasPaid = hasPaidMap[jobId] === true;

    if (!jobHasPaid && freePassUsed) {
      toast.error("접근이 제한되었습니다. 이 콘텐츠를 이용하시려면 결제가 필요합니다.");
      setWaiting(false);
      return;
    }

    // Build answers object from form fields "1_choice", "1_free", ..., "10_choice", "10_free"
    const answers: Record<string, { multiple_choice: string[]; free_text: string }> = {};
    for (let i = 1; i <= 10; i++) {
      const mcKey = `${i}_choice` as keyof T;
      const freeKey = `${i}_free` as keyof T;

      const rawMultipleChoice = form[mcKey];
      let multiple_choice: string[] = [];

      if (Array.isArray(rawMultipleChoice)) {
        multiple_choice = rawMultipleChoice;
      } else if (typeof rawMultipleChoice === "string" && rawMultipleChoice.trim() !== "") {
        multiple_choice = [rawMultipleChoice];
      }

      const free_text = (form[freeKey] as unknown as string) || "";

      if (multiple_choice.length > 0 || free_text.trim() !== "") {
        answers[String(i)] = {
          multiple_choice,
          free_text,
        };
      }
    }

    const input = {
      job_id: jobId,
      question_id: String(question_id).replace(/\s*\([^)]*\)/g, '').trim(),
      answers,
      draft,
    };

    let guide: GuideOutputProps | undefined;
    let essayResult: {essay: EssayOutputProps} | undefined;

    try {
      guide = await generateOutline(input);
      setGuide(guide);

      const payload = { user_input: input, guideline: {result: guide?.guideline} };
      essayResult = await generateEssay(payload);
      setEssay(essayResult?.essay);
    } catch (error) {
      console.error("Error generating guide or essay:", error);
      toast.error("가이드 또는 자소서 생성 중 오류가 발생했습니다");
      setWaiting(false);
      setRunning(false)
      return;
    }

    // Save flattened generation document under users/{uid}/generations/{docId}
     await addDoc(collection(db, "users", authUser.uid, "generations"), {
      createdAt: serverTimestamp(),
      input,
      guide: guide?.guideline,
      essay: essayResult?.essay.essay,
      job_id: jobId,
      question_id: question_id,
    });

    // Update user's generation count and hasPaid map for this job
    await updateDoc(userRef, {
      [`generation_count.${jobId}`]: increment(1),
    });
  } catch (e: any) {
    console.error("생성 횟수 업데이트에 실패했습니다.", e.message);
    toast.error("서버 오류가 발생했습니다.");
  } finally {
    setWaiting(false);
  }
}