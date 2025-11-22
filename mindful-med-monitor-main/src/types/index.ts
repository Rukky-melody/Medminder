// src/types.ts

// Define the structure of a User object based on your backend's response
export interface User {
  id: string;          // Comes directly from your backend's 'data.id'
  email: string;       // Comes directly from your backend's 'data.email'
  fullName?: string;   // IMPORTANT: Your backend sends 'fullName', not 'name'
  phoneNumber?: string;
  DOB?: string;
  gender?: string;
  createdAt: string;
  // Add any other user properties your backend might return, e.g.:
  // isEmailVerified?: boolean;
  // medications?: any[];
  // __v?: number;
  // _id?: string; // MongoDB's default ID
}

// Define the structure of the authentication response from your backend
export interface AuthResponse {
  token: string;
  data: User; // IMPORTANT: Your backend nests the user object under a 'data' property
}

// Other existing types you might have in src/types.ts
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instruction: string;
  frequency: string;
  reminderTimes: string[];
  daysOfWeek: string[];
  notes?: string;
  color?: string;
  shape?: string;
  startDate: string;
  endDate?: string;
  refillReminder?: boolean;
  refillDate?: string;
  refillAmount?: number;
  image?: string;
  userId?: string; // Added userId to associate medications with users
}

export interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  date: string;
  taken: boolean;
  skipped: boolean;
  notes?: string;
}

export interface NotificationPreference {
  email: boolean;
  sms: boolean;
  app: boolean;
  reminderOffset: number; // minutes before the scheduled time
}

export interface UserContact {
  phone?: string;
  email?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  DOB: string;
  gender: string;
  phoneNumber: string;
}
