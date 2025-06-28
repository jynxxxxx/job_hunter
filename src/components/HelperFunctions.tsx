import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const ensureUserProfile = async (user: any, name: string) => {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(
        userDocRef,
        {
          email: user.email,
          name: user.displayName || name,
          hasPaid: false,
          generation_count: 0,
        },
        { merge: true } // Use merge: true to avoid overwriting if partial data exists
      );
    } else {
    }
  };

export function convertFirebaseTimestamp(
  rawData: any,
  fieldName: string
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
    formattedDateTimeString = `${month}월 ${day}일 ${year}년 - ${hours}:${formattedMinutes}`;
  }

  return formattedDateTimeString;
}