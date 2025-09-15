import { db, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export interface LuckyNumber {
  id: string; // Firestore document ID
  date: string;
  number: string;
  revealTime: string;
}

export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error("Admin authentication failed:", error);
    return false;
  }
};

/**
 * Returns a date string in 'YYYY-MM-DD' format for the user's local timezone.
 * @param date The date to format.
 */
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a 'YYYY-MM-DD' string into a Date object in the local timezone.
 * This is safer than `new Date(string)` which can parse it as UTC.
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // The month is 0-indexed in the Date constructor.
  return new Date(year, month - 1, day);
};

export const getTodayNumber = async (): Promise<LuckyNumber | null> => {
  const today = getLocalDateString(new Date());
  const numbersCol = collection(db, "luckyNumbers");
  // Get all of today's numbers.
  // We will sort them on the client to avoid needing a composite index in Firestore.
  const q = query(numbersCol, where("date", "==", today));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    // Sort the numbers by reveal time ascending
    const allTodayNumbers = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as LuckyNumber))
      .map(doc => ({ ...doc.data(), id: doc.id } as LuckyNumber))
      .sort((a, b) => a.revealTime.localeCompare(b.revealTime));

    // Find the first number that hasn't been revealed yet.
    const nextNumber = allTodayNumbers.find(num => !isRevealTime(num.revealTime));

    if (nextNumber) {
      // We found an upcoming number for today.
      return nextNumber;
    } else {
      // All numbers for today have been revealed, so show the last one of the day.
      return allTodayNumbers[allTodayNumbers.length - 1];
    }
  } catch (error) {
    console.error("Error fetching today's number:", error);
    return null;
  }
};

export const getPastNumbers = async (filter: string = "week"): Promise<LuckyNumber[]> => {
  const numbersCol = collection(db, "luckyNumbers");
  let q;

  if (filter === "all") {
    q = query(numbersCol, orderBy("date", "desc"));
  } else {
    // This is a simplified filter. A real implementation would use date ranges.
    q = query(numbersCol, orderBy("date", "desc"), limit(filter === "week" ? 7 : 30));
  }

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LuckyNumber));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LuckyNumber));
  } catch (error) {
    console.error("Error fetching past numbers:", error);
    return [];
  }
};

export const addLuckyNumber = async (data: Omit<LuckyNumber, 'id'>): Promise<LuckyNumber> => {
  try {
    const docRef = await addDoc(collection(db, "luckyNumbers"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding lucky number:", error);
    throw error;
  }
};

export const updateLuckyNumber = async (id: string, data: Partial<Omit<LuckyNumber, 'id'>>): Promise<void> => {
  try {
    const numberDoc = doc(db, "luckyNumbers", id);
    await updateDoc(numberDoc, data);
  } catch (error) {
    console.error("Error updating lucky number:", error);
    throw error;
  }
};

export const deleteLuckyNumber = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "luckyNumbers", id));
  } catch (error) {
    console.error("Error deleting lucky number:", error);
    throw error;
  }
};

// Check if current time is past reveal time
export const isRevealTime = (revealTime: string): boolean => {
  const now = new Date();
  const [hours, minutes] = revealTime.split(':').map(Number);
  const revealDateTime = new Date();
  revealDateTime.setHours(hours, minutes, 0, 0);

  return now >= revealDateTime;
};

// Format time for display
export const formatTime = (time: string): string => {
  if (!time || !time.includes(':')) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};