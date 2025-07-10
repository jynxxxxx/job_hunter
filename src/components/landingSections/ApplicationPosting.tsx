"use client"

import styles from "@/styles/layout.module.scss";
import { useState, useEffect } from "react";

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
      <p>
        현재 <strong className={styles.strongText}>포스코스틸리온, SK하이닉스, LG에너지솔루션</strong> 신입사원 수시채용 전용 AI 자기소개서 서비스 시작
      </p>
      <a href="/dashboard" className={styles.ctaButton}>
        자세히 알아보기
      </a>
      <button className={styles.dismissButton} onClick={handleDismiss}>
        &times;
      </button>
    </div>
  );
};

export default ApplicationPosting;
