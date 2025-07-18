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
          subscription: {active: false},
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

export function parseCustomEndDate(dateString: string) {
  if (!dateString) {
    return new Date(NaN);
  }
  
  // Example: "2025/07/12 (23:59)"
  const parts = dateString.match(/(\d{4})\/(\d{2})\/(\d{2}) \((\d{2}):(\d{2})\)/);

  if (!parts) {
    console.warn(`Invalid date format for: ${dateString}. Expected YYYY/MM/DD (HH:mm)`);
    return new Date(NaN); // Return an invalid date
  }

  const year = parseInt(parts[1], 10);
  const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed in JavaScript Date
  const day = parseInt(parts[3], 10);
  const hours = parseInt(parts[4], 10);
  const minutes = parseInt(parts[5], 10);

  // Construct a Date object in the LOCAL timezone
  // This is important because 'now' is also in the local timezone.
  return new Date(year, month, day, hours, minutes, 0, 0); // Year, Month, Day, Hour, Minute, Second, Millisecond
}

export const scrollToElementWithOffset = (ref: React.RefObject<HTMLElement | HTMLDetailsElement | null>, offsetRatio = 0.3) => {
  if (!ref.current) return;

  const rect = ref.current.getBoundingClientRect();
  const scrollY = window.scrollY;
  const elementTop = rect.top + scrollY;
  const offset = window.innerHeight * offsetRatio;

  window.scrollTo({
    top: elementTop - offset,
    behavior: 'smooth',
  });
};
