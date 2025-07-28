"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function FeedbackPopup() {
  const { authUser } = useAuth();
  const pathname = usePathname();
  const [openPopup, setOpenPopup] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);


  const excludedPaths = ["/", "/login"];
  const isPathExcluded = excludedPaths.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  useEffect(() => {
    if (!authUser) {
      setOpenPopup(false)
    } 

    if (isPathExcluded) return;

    const today = new Date().toISOString().split("T")[0];
    const dismissedDate = localStorage.getItem("feedbackPopupDismissed");
    const hasClickedBefore = localStorage.getItem("hasClickedGenerate") === "true";

    if (dismissedDate === today) return;

    // Show immediately if already clicked generate before
    if (hasClickedBefore && dismissedDate !== today && !openPopup) {
      setTimeout(() => {
        setOpenPopup(true);
      }, 1500); // can be 0 if you want instant
    }

    const handleGenerateClick = (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        target?.closest('[data-track="generate-click"]') &&
        dismissedDate !== today
      ) {
        localStorage.setItem("hasClickedGenerate", "true");
        setTimeout(() => {
          setOpenPopup(true);
        }, 3000);
      }
    };

    document.addEventListener("click", handleGenerateClick);
    return () => {
      document.removeEventListener("click", handleGenerateClick);
    };
  }, [authUser, pathname, isPathExcluded, openPopup]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0];
    if (dontShowToday) {
      localStorage.setItem("feedbackPopupDismissed", today);
    }
    setOpenPopup(false);
  };

  if (!openPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 z-500 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80 animate-slide-up transition-all">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-900 font-medium">
          오늘 서비스는 어땠나요?
        </p>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        간단한 피드백을 남겨주시면 <strong>10,000원 배민 쿠폰</strong> 제공합니다.
      </p>
      <a
        href="https://forms.gle/GbM51Xcud3ZdyRM47"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-dark text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-blue-800 transition"
      >
        피드백 남기기
      </a>
      <p className="text-xs text-gray-500 mt-1 text-center">구글 폼이 새 창에서 열립니다</p>
      <div className="flex justify-between items-center mt-4">
        <label className="text-xs flex items-center gap-2">
          <input
            type="checkbox"
            checked={dontShowToday}
            onChange={(e) => setDontShowToday(e.target.checked)}
            className="accent-black"
          />
          오늘 하루 안 보기 
        </label>
        <button
          className="text-xs text-gray-500 hover:underline"
          onClick={handleDismiss}
        >
          닫기
        </button>
      </div>
    </div>
  );
}