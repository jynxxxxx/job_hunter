import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { generateEssay, generateOutline } from "@/app/api/generate";
import { HyundaiEssayOutputProps, HyundaiGuideOutputProps } from "@/types/forms";

interface UploadParams<T> {
  form: T;
  draft: string;
  company: string;
  authUser: any;
  userData: any;
  setWaiting: (b: boolean) => void;
  setEssay: (essay: any) => void;
  setGuide: (guide: any) => void;
  questionId: number;
  requiredFields: (keyof T)[];
}

export async function handleUpload<T>({
  form,
  draft,
  company,
  userData,
  authUser,
  setWaiting,
  setEssay,
  setGuide,
  questionId,
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

  if (!authUser) {
    toast.error("로그인이 필요합니다.");
    setWaiting(false);
    return;
  }

  setWaiting(true);
  document.getElementById("top")?.scrollIntoView();

  let hasPaid = false;
  try {
    const userDoc = await getDoc(doc(db, "users", authUser.uid));
    hasPaid = userDoc.exists() && userDoc.data().hasPaid === true;
  } catch {
    toast.error("사용자 정보를 불러오는 중 오류가 발생했습니다.");
    setWaiting(false);
    return;
  }

  if ((userData?.generation_count ?? 0) > 2 && !userData?.hasPaid) {
    toast.error("접근이 제한되었습니다. 이 콘텐츠를 이용하시려면 결제가 필요합니다.");
    setWaiting(false);
    return;
  }

  try {
    const data = { ...form, question_id: questionId, draft };
    let guide: HyundaiGuideOutputProps | undefined;
    let essay: HyundaiEssayOutputProps | undefined;

    try {
      guide = await generateOutline(data);
      setGuide(guide);

      const payload = { user_input: data, guideline: guide };
      essay = await generateEssay(payload);
      setEssay(essay);
    } catch (error) {
      console.error("Error generating guide or essay:", error);
      toast.error("가이드 또는 자소서 생성 중 오류가 발생했습니다")
      return; 
    }

    await addDoc(collection(db, "users", authUser.uid, "generations"), {
      createdAt: serverTimestamp(),
      input: data,
      guide: guide?.result,
      essay: essay?.essay,
      company: company
    });
    const userRef = doc(db, "users", authUser.uid);
    await updateDoc(userRef, {
      generation_count: increment(1),
    });
  } catch (e: any) {
    console.error("생성 횟수 업데이트에 실패했습니다.", e.message);
  } finally {
    setWaiting(false);
  }
}