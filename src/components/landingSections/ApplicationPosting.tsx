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
      <div className="ml-auto md:ml-0 absolute top-2 right-4">
        <button className={styles.dismissButton} onClick={handleDismiss}>
          &times;
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-4/5">
          <div className="flex justify-center items-center gap-4 text-[1.3rem]">
            <p>
              <strong className={styles.strongText}>SK하이닉스, LG에너지솔루션 </strong> <span className="text-[1rem]">등</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPosting;
