"use client"

import styles from "@/styles/layout.module.scss";
import { useState } from "react";

const ApplicationPosting = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false); // Hide the banner
  };

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div className={`${styles.announcementBanner} bg-[#465974]/80`}>
      <div className="ml-auto md:ml-0 absolute top-2 right-4">
        <button className={styles.dismissButton} onClick={handleDismiss}>
          &times;
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-4/5">
          <div className="flex flex-col justify-center items-center gap-2 text-10 sm:text-[1.2rem] text-white">
            <span className="text-lg font-semibold">🎉 친구 초대 이벤트 진행 중!</span>
            <div className="flex flex-col text-sm">
              <span>• 📩 추천코드 3명 이상 초대 또는 카카오톡 단톡방(5명 이상)&nbsp;<br className="sm:hidden" />공유 + 스크린샷 인증 시 → <span className="font-semibold text-green-400">스타벅스 쿠폰</span> 제공!</span>
              <span>• 🏆 추천 1등에게는 → <span className="font-semibold text-blue-400">에어팟 프로 2세대</span>!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPosting;
