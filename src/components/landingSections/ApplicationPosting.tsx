"use client"

import styles from "@/styles/layout.module.scss";
import { useState } from "react";

const ApplicationPosting = () => {
  const [isVisible, setIsVisible] = useState(true);

  // useEffect(() => {
  //   // Check local storage on component mount
  //   const dismissed = localStorage.getItem('announcementDismissed');
  //   if (dismissed !== 'true') {
  //     setIsVisible(true); // Show banner if not dismissed
  //   }
  // }, []); // Empty dependency array means this runs once on mount

  const handleDismiss = () => {
    setIsVisible(false); // Hide the banner
    // localStorage.setItem('announcementDismissed', 'true'); // Store dismissal state
  };

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div className={styles.announcementBanner}>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-4/5">
          <div className="flex justify-center items-center gap-4">
            <p>
              현재 <strong className={styles.strongText}>SK하이닉스, LG에너지솔루션, 포스코스틸리온</strong> 수시채용 맞춤 서비스 제공
            </p>
          </div>
          <div className="pt-4 text-[1.4rem] lg:text-[1.7rem]">
            7월11일 금요일 23:59까지 <strong>AI 자기소개서 서비스 선착순 제공!</strong>
          </div>
        </div>
        <div className="ml-auto md:ml-0">
          <a href="/dashboard" className={styles.ctaButton}>
            자세히 알아보기
          </a>
          <button className={styles.dismissButton} onClick={handleDismiss}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPosting;
