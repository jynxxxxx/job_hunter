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
    <div className={`${styles.announcementBanner} bg-[#465974]`}>
      <div className="ml-auto md:ml-0 absolute top-2 right-4">
        <button className={styles.dismissButton} onClick={handleDismiss}>
          &times;
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-4/5">
          <div className="flex justify-center items-center gap-4 text-10 sm:text-[1.2rem]">
            <p>
              29일까지 <strong className={styles.strongText}>&lt;30분 무료 자소서 컨설팅&gt;</strong>&nbsp;<br className="sm:hidden" /><span className="text-8 sm:text-[1.2rem]">15년 경력 인사담당자와 1:1로 만나보세요!</span>
              <br/>
              <a href="https://calendly.com/teambarojiwon/30" className="text-[0.8rem] hover:text-[0.85rem]">https://calendly.com/teambarojiwon/30</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPosting;
