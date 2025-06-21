"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { CheckCircle, Clock, Users } from "lucide-react";
import signUpStyles from "@/styles/signup.module.scss";

const SignupForm = () => {
  const [signedUp, setSignedUp] = useState(268);
  const [form, setForm] = useState<{ email: string; resume: File | null }>({
    email: "",
    resume: null,
  });

  async function fetchRowCount() {
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    setSignedUp(268 + (count ?? 0));
  }

  useEffect(() => {
    fetchRowCount();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      const file = files && files[0];
      if (file && file.type === "application/pdf") {
        setForm(f => ({ ...f, resume: file }));
      } else {
        setForm(f => ({ ...f, resume: null }));
        toast.error("Please upload a PDF file.");
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!form.email || !form.resume) {
      toast.error("이메일과 이력서를 모두 제출해주세요.");
      return;
    }

    // 1. Check for existing email
    const { data: emailData } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", form.email)
      .single();

    if (emailData) {
      toast.error("이 이메일은 이미 등록되어 있습니다.");
      return;
    }

    if (form.resume) {
      console.log("File size in bytes:", form.resume.size);
      console.log("File size in kilobytes:", form.resume.size / 1024);
    }
    if (form.resume.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("이 파일은 너무 큽니다. 최대 허용 용량은 50MB입니다.");
      return;
    }
    const timestamp = Date.now();
    const emailPrefix = form.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedFilename = form.resume.name.replace(/\s/g, "_");
    const filePath = `${emailPrefix}_${timestamp}_${sanitizedFilename}`;

    console.log(filePath)
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, form.resume, {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("이력서 업로드에 실패했습니다.");
      return;
    }

    const { error: insertError } = await supabase
    .from("waitlist").insert([
      {
        email: form.email,
        resume_path: filePath,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      toast.error("데이터 저장 중 문제가 발생했습니다.");
      return;
    }
    
    await fetchRowCount();
    toast.success("신청이 완료되었습니다!");
    setForm({ email: "", resume: null });
  }

  return (
    <section className={signUpStyles.ctn} id="signup-forms">
      {/* <div className={signUpStyles.badge}>
        <Clock className={signUpStyles.icon} />
        <span>사전 등록 마감 임박 • 500명 한정</span>
      </div> */}

      <h2 className={signUpStyles.title}>지금 바로 사전 등록 신청하기</h2>
      <p className={signUpStyles.subtitle}>
        선착순 500명에게 드리는 특별 혜택
      </p>
      <div className={signUpStyles.benefitctn}>
        <div className={signUpStyles.disclaimer}> 
          ①, ②는 사전 등록자 1회 한정. 신청후 72시간내에 전달.
        </div>
        <div className={signUpStyles.benefit}>
          <div className={signUpStyles.numberIcon}>
            1
          </div>
          합격자 자소서 템플릿
        </div>
        <div className={signUpStyles.benefit}>
          <div className={signUpStyles.numberIcon}>
            2
          </div>
          대기업 선배들에게 이력서 피드백
        </div>
        <div className={signUpStyles.benefit}>
          <div className={signUpStyles.numberIcon}>
            3
          </div>
          정식 출시 후 1개월간 
          <br />바로지원 서비스 무료
        </div>
      </div>
      <div className={signUpStyles.scenario}><strong>현재 {signedUp}명이 신청했습니다.</strong></div>

      <div className={signUpStyles.progressbox}>
        <div className={signUpStyles.progressinfo}>
          <Users className={signUpStyles.userIcon} />
          <span className={signUpStyles.count}>{signedUp}</span>
          <span className={signUpStyles.total}>/ 500명</span>
        </div>
        <div className={signUpStyles.progressbar}>
          <div 
            className={signUpStyles.progressfill}
            style={{ width: `${(signedUp / 500) * 100}%` }}
          />
        </div>
        <p className={signUpStyles.remaining}>{500 - signedUp}자리 남음</p>
      </div>
      <form className={signUpStyles.form} onSubmit={handleSubmit}>
        <div className={signUpStyles.rowOne}>
          <label>
            이메일:
          </label>
          <input
            className={signUpStyles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={signUpStyles.rowTwo}>
          <div className={signUpStyles.fileInput}>
            <label>
              이력서 (PDF 파일만 가능):
            </label>
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleChange}
              required
            />
          </div>
          <button className={signUpStyles.btn}>
            사전 등록 신청하기
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignupForm;