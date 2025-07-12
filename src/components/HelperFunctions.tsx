import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const ensureUserProfile = async (user: any, name: string, eventSourceUrl?: string) => {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(
        userDocRef,
        {
          email: user.email,
          name: user.displayName || name,
          hasPaid: {},
          createdAt: serverTimestamp(),
        },
        { merge: true } // Use merge: true to avoid overwriting if partial data exists
      );

      // meta conversion api call
      if (eventSourceUrl) {
      await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'SignUp',
          eventSourceUrl,
          email: user.email,
        }),
      });
    }
    } else {
    }
  };

export function convertFirebaseTimestamp(
  rawData: any,
  fieldName: string,
  formatType: 'long' | 'short' = 'long'
): string {
  let convertedDate: Date | null = null;
  let formattedDateTimeString = '';

  const rawValue = rawData?.[fieldName];

  if (rawValue !== undefined && rawValue !== null) {
    if (typeof rawValue === 'object' && typeof rawValue.toDate === 'function') {
      convertedDate = rawValue.toDate(); // Firebase Timestamp
    } else if (rawValue instanceof Date) {
      convertedDate = rawValue; // Already a JS Date
    } else if (typeof rawValue === 'string') {
      convertedDate = new Date(rawValue); // Stored as ISO string
    }
  }

  if (convertedDate) {
    const year = convertedDate.getFullYear();
    const month = convertedDate.getMonth() + 1;
    const day = convertedDate.getDate();
    const hours = convertedDate.getHours();
    const minutes = convertedDate.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const paddedMonth = month < 10 ? `0${month}` : `${month}`;
    const paddedDay = day < 10 ? `0${day}` : `${day}`;
    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;

    if (formatType === 'long') {
      // Example: 7월 3일 2025년 - 15:00
      formattedDateTimeString = `${month}월 ${day}일 ${year}년 - ${paddedHours}:${formattedMinutes}`;
    } else if (formatType === 'short') {
      // Example: 2025/07/03 (15:00)
      formattedDateTimeString = `${year}/${paddedMonth}/${paddedDay} (${paddedHours}:${formattedMinutes})`;
    }
  }

  return formattedDateTimeString;
}

// Helper to get template for a company/job
export function getQuestionTemplate(job_id: string, jobTemplates: any[]) {
  return jobTemplates.find(t => t.job_id === job_id);
}