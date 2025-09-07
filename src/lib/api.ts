// Mock API functions - replace with real Supabase/API calls when backend is connected

export interface LuckyNumber {
  id: number;
  date: string;
  number: number;
  revealTime: string;
}

// Mock authentication
export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock authentication - replace with real auth
  return username === "admin" && password === "admin123";
};

// Mock lucky number operations
export const getTodayNumber = async (): Promise<LuckyNumber | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Mock data - replace with real API call
  return {
    id: 1,
    date: today,
    number: 777,
    revealTime: "14:00"
  };
};

export const getPastNumbers = async (filter: string = "week"): Promise<LuckyNumber[]> => {
  // Mock data - replace with real API call
  return [
    { id: 1, date: "2024-01-07", number: 777, revealTime: "14:00" },
    { id: 2, date: "2024-01-06", number: 342, revealTime: "14:00" },
    { id: 3, date: "2024-01-05", number: 891, revealTime: "14:00" },
    { id: 4, date: "2024-01-04", number: 156, revealTime: "14:00" },
    { id: 5, date: "2024-01-03", number: 623, revealTime: "14:00" },
  ];
};

export const addLuckyNumber = async (data: Omit<LuckyNumber, 'id'>): Promise<LuckyNumber> => {
  // Mock data - replace with real API call
  return {
    id: Date.now(),
    ...data
  };
};

export const updateLuckyNumber = async (id: number, data: Partial<LuckyNumber>): Promise<LuckyNumber> => {
  // Mock data - replace with real API call
  return {
    id,
    date: data.date || new Date().toISOString().split('T')[0],
    number: data.number || 0,
    revealTime: data.revealTime || "14:00"
  };
};

export const deleteLuckyNumber = async (id: number): Promise<void> => {
  // Mock data - replace with real API call
  console.log(`Deleting number with ID: ${id}`);
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
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};