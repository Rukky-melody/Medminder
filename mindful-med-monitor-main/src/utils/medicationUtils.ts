// src/utils/medicationUtils.ts
import { Medication, Reminder } from "../types";
import { api } from "./authService"; // Assuming authService handles API calls

// Generate a unique ID (fallback for local development)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().slice(0, 10);

// Get medications from API
export const getMedications = async (): Promise<Medication[]> => {
  try {
    const response = await api.get('/medications');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch medications:", error);
    // Return empty array on error to prevent breaking consuming components
    return [];
  }
};

// Add a new medication
export const addMedication = async (medication: Medication): Promise<Medication> => {
  try {
    const response = await api.post('/medications/add', medication);
    return response.data;
  } catch (error) {
    console.error("Failed to add medication:", error);
    throw error; // Re-throw to allow component to handle
  }
};

// Update an existing medication
export const updateMedication = async (medication: Medication): Promise<Medication> => {
  try {
    const response = await api.patch(`/medications/${medication.id}`, medication);
    return response.data;
  } catch (error) {
    console.error("Failed to update medication:", error);
    throw error;
  }
};

// Delete a medication
export const deleteMedication = async (id: string): Promise<void> => {
  try {
    await api.delete(`/medications/${id}`);
  } catch (error) {
    console.error("Failed to delete medication:", error);
    throw error;
  }
};

// Get all reminders from localStorage
export const getReminders = (): Reminder[] => {
  try {
    const storedReminders = localStorage.getItem('reminders');
    return storedReminders ? JSON.parse(storedReminders) : [];
  } catch (e) {
    console.error("Error reading reminders from localStorage:", e);
    // If data is corrupted, clear it to prevent continuous errors
    localStorage.removeItem('reminders');
    return [];
  }
};

// Save reminders to localStorage
export const saveReminders = (reminders: Reminder[]): void => {
  try {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  } catch (e) {
    console.error("Error saving reminders to localStorage:", e);
  }
};

/**
 * Generates new reminder entries for the current day based on active medications.
 * It intelligently avoids creating duplicate reminders for the same medication/time/date.
 * @returns An array of newly generated Reminder objects.
 */
export const generateTodayReminders = async (): Promise<Reminder[]> => {
  const medications = await getMedications(); // Fetch latest medications
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday" (full name for comparison)
  const todayDateString = getTodayDateString();

  const newReminders: Reminder[] = [];
  // Get all reminders already stored to avoid creating duplicates
  const allStoredReminders = getReminders();

  for (const med of medications) {
    // Check if medication is active today based on startDate and daysOfWeek
    const medStartDate = new Date(med.startDate);
    if (medStartDate <= today && med.daysOfWeek.includes(dayName)) {
      for (const time of med.reminderTimes) {
        // Create a unique ID for the reminder, combining medication ID, date, and time
        // This makes sure a specific reminder (e.g., "medId-2025-06-10-09:00") is unique
        const reminderId = `${med.id}-${todayDateString}-${time}`;

        // Check if this specific reminder already exists in the *entire* stored list
        const alreadyExists = allStoredReminders.some(r => r.id === reminderId);

        if (!alreadyExists) {
          newReminders.push({
            id: reminderId, // Unique ID for this specific daily reminder
            medicationId: med.id,
            time: time,
            date: todayDateString,
            taken: false,
            skipped: false,
            notes: '', // Initialize notes if not present
          });
          console.log(`[medicationUtils] Generated new reminder: ${med.name} at ${time}`);
        } else {
          // console.log(`[medicationUtils] Reminder for ${med.name} at ${time} already exists. Skipping.`);
        }
      }
    }
  }
  return newReminders;
};

// Mark a reminder as taken or skipped
export const updateReminderStatus = (reminderId: string, taken: boolean, skipped: boolean): void => {
  const reminders = getReminders();
  const updatedReminders = reminders.map(reminder =>
    reminder.id === reminderId
      ? { ...reminder, taken, skipped }
      : reminder
  );
  saveReminders(updatedReminders);
};

// Get upcoming reminders (for the current day and in the future, sorted by time)
export const getUpcomingReminders = (): Reminder[] => {
  const allReminders = getReminders();
  const now = new Date();
  const todayDateString = getTodayDateString();
  const currentTime = now.toTimeString().slice(0, 5); // HH:mm

  return allReminders.filter(r =>
    r.date === todayDateString && // Filter for today's date
    !r.taken && !r.skipped && // Only pending reminders
    r.time >= currentTime // Reminders that are current or still in the future (HH:mm comparison)
  ).sort((a, b) => a.time.localeCompare(b.time)); // Sort by time
};

// Get today's reminders for tracking (all for the day, sorted by time)
export const getTodayReminders = (): Reminder[] => {
  const reminders = getReminders();
  const today = getTodayDateString(); // Use the helper
  
  return reminders.filter(reminder => reminder.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
};

// Search for drug information (placeholder for now)
export const searchDrugInfo = async (drugName: string): Promise<string> => {
  try {
    const formattedDrugName = encodeURIComponent(drugName.trim());
    return `https://en.wikipedia.org/wiki/${formattedDrugName}`;
  } catch (error) {
    console.error("Error searching for drug info:", error);
    return "";
  }
};
