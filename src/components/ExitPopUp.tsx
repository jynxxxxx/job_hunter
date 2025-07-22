"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ExitPopUp() {
  const { authUser } =useAuth()
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const pathname = usePathname();

  // Only trigger popup if current pathname starts with one of these
  const includedPaths = ["/generate", "/history", "/revision"];

  const isPathIncluded = includedPaths.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  const handleSurveySubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const reasonToSend =
        selectedReason === "기타" ? otherReason.trim() : selectedReason;
      if (!reasonToSend) return;
      
      const { error } = await supabase.from('exit_data').insert([
        {
          page: pathname,
          reason: reasonToSend,
          email: authUser?.email,
          user_id: authUser?.uid,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        return
      } else {
        toast.success('피드백 주셔서 감사합니다.');
      }

      console.log("Exit Survey Submitted:", { reason: reasonToSend, page: pathname });
      // send reasonToSend to backend or analytics here

      setShowSurvey(false);
      setSelectedReason("");
      setOtherReason("");
      localStorage.setItem("exitSurveyLastShown", Date.now().toString());
      document.body.style.overflow = "";
    },
    [selectedReason, otherReason, pathname, authUser]
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    let isNearTop = false;
    let hasInteracted = false;
    let hasClickedGenerate = localStorage.getItem('hasClickedGenerate') === 'true';

    const handleInteraction = () => {
      hasInteracted = true;
      window.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    const handleGenerateClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-track="generate-click"]')) {
        hasClickedGenerate = true;
        localStorage.setItem('hasClickedGenerate', 'true');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInteracted || hasClickedGenerate) return;
      if (e.clientY <= 30 && !isNearTop) {
        isNearTop = true;
        timerId = setTimeout(() => {
          isNearTop = false;
        }, 300);
      }
      if (e.clientY > 50 && isNearTop && timerId) {
        clearTimeout(timerId);
        isNearTop = false;
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (!hasInteracted || hasClickedGenerate) return;
      if (
        e.clientY > 0 ||
        showSurvey ||
        !isPathIncluded ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth
      ) {
        return;
      }

      const lastShown = localStorage.getItem("exitSurveyLastShown");
      if (lastShown && Date.now() - Number(lastShown) < 24 * 60 * 60 * 1000) return;

      if (!isNearTop) return;

      setShowSurvey(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener('scroll', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
    document.addEventListener('click', handleGenerateClick);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('click', handleGenerateClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timerId) clearTimeout(timerId);
    };
  }, [showSurvey, isPathIncluded]);

  if (!showSurvey) return null;

  const reasons = [
    { value: "사용법이 너무 어려워요" },
    { value: "기대했던 기능이 아니에요" },
    { value: "서비스를 믿기 어려워요" },
    { value: "더 자세한 정보가 필요해요" },
    { value: "그냥 둘러보는 중이었어요" },
    { value: "기타" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={() => {
        setShowSurvey(false);
        setSelectedReason("");
        setOtherReason("");
        document.body.style.overflow = "";
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 30,
          borderRadius: 8,
          maxWidth: 550,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ textAlign:'center', fontSize: 24, marginBottom: 10, color: "#333" }}>
          잠깐! 혹시 떠나시는 이유가 있으실까요?
        </h2>
        <p style={{ textAlign:'center', fontSize: 16, color: "#666", marginBottom: 20 }}>
          어떤 점이 아쉬웠는지 알려주시면 감사하겠습니다 &#x1F60A;
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {reasons.map(({ value }) => (
            <label
              key={value}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedReason === value ? "#e0f2f7" : "#f8f8f8",
                padding: 10,
                borderRadius: 5,
                border:
                  selectedReason === value ? "1px solid #007bff" : "1px solid #ddd",
              }}
            >
              <input
                type="radio"
                name="exitReason"
                value={value}
                checked={selectedReason === value}
                onChange={(e) => setSelectedReason(e.target.value)}
                style={{ marginRight: 8 }}
              />
              {value == "기타" ? "기타 (편하게 이야기해주세요)" : value}
            </label>
          ))}
        </div>

        {selectedReason === "기타" && (
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="여기에 자유롭게 써주세요..."
            rows={2}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 10,
              border: "1px solid #ccc",
              borderRadius: 5,
              resize: "vertical",
            }}
          />
        )}

        <button
          onClick={handleSurveySubmit}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 18,
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          의견 제출하기
        </button>

        <button
          onClick={() => {
            setShowSurvey(false);
            setSelectedReason("");
            setOtherReason("");
            document.body.style.overflow = "";
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: 16,
            color: "#666",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          아니요, 괜찮습니다 (닫기)
        </button>
      </div>
    </div>
  );
}
