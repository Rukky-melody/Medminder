
// Export from medicationUtils and authService
export * from './medicationUtils';
export * from './authService';

// Explicitly export types from types/index.ts
export type { 
  Medication, 
  Reminder, 
  NotificationPreference, 
  UserContact, 
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse
} from '@/types';

// Export notification functions (prioritizing notificationService implementations)
export {
  getNotificationPreferences,
  saveNotificationPreferences,
  getUserContact,
  saveUserContact,
  requestNotificationPermission,
  showAppNotification,
  scheduleAppNotification,
  scheduleNotifications,
  checkNotificationsDue,
  sendSmsReminder,
  sendEmailReminder
} from './notificationService';
