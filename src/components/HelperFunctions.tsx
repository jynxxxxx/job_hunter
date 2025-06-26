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
        },
        { merge: true } // Use merge: true to avoid overwriting if partial data exists
      );
    } else {
    }
  };

export function ConvertFirebaseTimestamp(userDocSnapData: any) {
  const rawData = userDocSnapData; // Get the raw data from Firestore first

  let convertedResumeUploadDate: Date | null = null; // Will hold the JavaScript Date object
  let formattedDateTimeString: string = '';           // Will hold the formatted string for display

  // --- ⭐ Start of Robust Type Conversion Logic ⭐ ---
  if (rawData && rawData.resumeUploadDate !== undefined && rawData.resumeUploadDate !== null) {
    // Case 1: It's a Firebase Timestamp object (expected if stored with serverTimestamp())
    if (typeof rawData.resumeUploadDate === 'object' && typeof (rawData.resumeUploadDate as any).toDate === 'function') {
      convertedResumeUploadDate = (rawData.resumeUploadDate as any).toDate();
    }
    // Case 2: It's already a standard JavaScript Date object (less common from raw Firestore, but safe to include)
    else if (rawData.resumeUploadDate instanceof Date) {
      convertedResumeUploadDate = rawData.resumeUploadDate;
    }
    // Case 3: It's a string (e.g., from older data or if you previously stored it as a string)
    else if (typeof rawData.resumeUploadDate === 'string') {
      convertedResumeUploadDate = new Date(rawData.resumeUploadDate);
    }
    // If it's any other unexpected type, convertedResumeUploadDate will remain null
  }
  // --- ⭐ End of Robust Type Conversion Logic ⭐ ---

  // --- ⭐ Start of Formatting Logic ⭐ ---
  if (convertedResumeUploadDate) { // Only format if we successfully got a Date object
    const year = convertedResumeUploadDate.getFullYear();
    const month = convertedResumeUploadDate.getMonth() + 1; // getMonth() is 0-indexed
    const day = convertedResumeUploadDate.getDate();
    const hours = convertedResumeUploadDate.getHours();
    const minutes = convertedResumeUploadDate.getMinutes();

    // Ensure minutes are always two digits (e.g., 5 -> 05)
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    // Construct the string in the desired "X월 X일 X년 - X:XX시간" format
    formattedDateTimeString = `${month}월 ${day}일 ${year}년 - ${hours}:${formattedMinutes}`;
  }

  return formattedDateTimeString
}