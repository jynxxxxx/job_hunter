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
    <div className={`${styles.announcementBanner} bg-gray-800/60`}>
      <div className="ml-auto md:ml-0 absolute top-2 right-4">
        <button className={styles.dismissButton} onClick={handleDismiss}>
          &times;
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-4/5 bg-gray-800/70 rounded-xl py-2">
          <div className="flex flex-col justify-center items-center gap-2 text-white">
            <span className="text-lg font-semibold">🎉 친구 초대 이벤트 진행 중!</span>
              <span className="text-base">🏆 추천 1등에게는 → <span className="font-semibold text-blue-400">에어팟 프로 2세대</span>!
            </span>
            <span className="text-base">
              📩 친구 3명 이상이 내 추천코드를 입력하고 &nbsp;<br className="sm:hidden" />회원 가입하면 <span className="font-semibold text-green-400">스타벅스 2만원 쿠폰</span> 제공
              <p className="text-xs">추천 코드는 우측 상단 마이 페이지에 있어요.</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPosting;
