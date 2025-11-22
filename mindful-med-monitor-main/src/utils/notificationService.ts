
import { NotificationPreference, UserContact, Reminder, Medication } from "../types";

// Get notification preferences from localStorage
export const getNotificationPreferences = (): NotificationPreference => {
  const storedPreferences = localStorage.getItem('notificationPreferences');
  if (storedPreferences) {
    return JSON.parse(storedPreferences);
  }
  return {
    email: false,
    sms: false,
    app: true,
    reminderOffset: 15 // default 15 minutes before
  };
};

// Save notification preferences to localStorage
export const saveNotificationPreferences = (preferences: NotificationPreference): void => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
};

// Get contact information from localStorage
export const getUserContact = (): UserContact => {
  const storedContact = localStorage.getItem('userContact');
  if (storedContact) {
    return JSON.parse(storedContact);
  }
  return {};
};

// Save contact information to localStorage
export const saveUserContact = (contact: UserContact): void => {
  localStorage.setItem('userContact', JSON.stringify(contact));
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  let permission = Notification.permission;
  
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  
  return permission === 'granted';
};

// Show an app notification
export const showAppNotification = (title: string, body: string): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico'
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// Schedule app notification for a reminder
export const scheduleAppNotification = (reminder: Reminder, medication: Medication): void => {
  const preferences = getNotificationPreferences();
  
  if (!preferences.app) return;
  
  const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
  const notificationTime = new Date(reminderTime.getTime() - (preferences.reminderOffset * 60 * 1000));
  const now = new Date();
  
  if (notificationTime > now) {
    const timeoutDuration = notificationTime.getTime() - now.getTime();
    
    setTimeout(() => {
      showAppNotification(
        `Time to take ${medication.name}`,
        `Dosage: ${medication.dosage}, Instructions: ${medication.instruction}`
      );
    }, timeoutDuration);
  }
};

// Process upcoming reminders and schedule notifications
export const scheduleNotifications = (reminders: Reminder[], medications: Medication[]): void => {
  reminders.forEach(reminder => {
    const medication = medications.find(med => med.id === reminder.medicationId);
    if (medication) {
      scheduleAppNotification(reminder, medication);
    }
  });
};

// Check if notifications are due
export const checkNotificationsDue = (): void => {
  // In a real app, this would handle SMS and email notifications
  // For the web app prototype, we'll just use browser notifications
  console.log('Checking for due notifications...');
};

// Simulated SMS service (placeholder for now)
export const sendSmsReminder = (phoneNumber: string, message: string): Promise<boolean> => {
  // In a real app, this would call an SMS API
  console.log(`Would send SMS to ${phoneNumber}: ${message}`);
  return Promise.resolve(true);
};

// Simulated email service (placeholder for now)
export const sendEmailReminder = (email: string, subject: string, message: string): Promise<boolean> => {
  // In a real app, this would call an email API
  console.log(`Would send email to ${email}: ${subject} - ${message}`);
  return Promise.resolve(true);
};
