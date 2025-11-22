
import { NotificationPreference, UserContact } from '@/types';

// Default notification preferences
const defaultNotificationPreferences: NotificationPreference = {
  email: false,
  sms: false,
  app: true,
  reminderOffset: 15 // 15 minutes before
};

// Default user contact
const defaultUserContact: UserContact = {
  phone: '',
  email: ''
};

// Get notification preferences from localStorage
export const getNotificationPreferences = (): NotificationPreference => {
  const savedPrefs = localStorage.getItem('notificationPreferences');
  return savedPrefs ? JSON.parse(savedPrefs) : defaultNotificationPreferences;
};

// Save notification preferences to localStorage
export const saveNotificationPreferences = (preferences: NotificationPreference): void => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
};

// Get user contact information from localStorage
export const getUserContact = (): UserContact => {
  const savedContact = localStorage.getItem('userContact');
  return savedContact ? JSON.parse(savedContact) : defaultUserContact;
};

// Save user contact information to localStorage
export const saveUserContact = (contact: UserContact): void => {
  localStorage.setItem('userContact', JSON.stringify(contact));
};
