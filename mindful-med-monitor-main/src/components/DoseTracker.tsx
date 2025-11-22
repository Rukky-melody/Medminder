import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Pill, Check, X } from 'lucide-react';
import { Reminder, Medication } from '@/types';
import {
  getTodayReminders,
  updateReminderStatus,
  generateTodayReminders,
  saveReminders,
  getReminders // This now consistently refers to the getReminders in medicationUtils.ts
} from '@/utils/medicationUtils'; // IMPORTANT: Verify this file exists at src/utils/medicationUtils.ts (or .tsx)
import { useToast } from "@/components/ui/use-toast"; // IMPORTANT: Verify this file exists at src/components/ui/use-toast.ts (or .tsx) and your tsconfig/jsconfig.json handles '@/' alias correctly.

interface DoseTrackerProps {
  medications: Medication[];
}

const DoseTracker: React.FC<DoseTrackerProps> = ({ medications }) => {
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    console.log("[DoseTracker] medications prop changed. Loading today's reminders.");
    loadTodayReminders();
  }, [medications]); // Dependency array: medications. This re-runs when medications change (e.g., loaded from API)

  const loadTodayReminders = async () => {
    const todayDateString = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const lastGeneratedDate = localStorage.getItem('lastRemindersGeneratedDate');
    
    // Get all reminders (from all days) that are currently stored
    let allCurrentStoredReminders = getReminders();
    let remindersForToday = allCurrentStoredReminders.filter(r => r.date === todayDateString);

    // Logic to generate reminders only once per day:
    // Generate only if:
    // 1. There are no reminders for today currently in storage (`remindersForToday.length === 0`)
    // AND 2. We haven't marked them as generated for today already (`lastGeneratedDate !== todayDateString`)
    //    (This handles component remounts on the same day)
    // AND 3. We have medications to generate from (`medications.length > 0`).
    if (remindersForToday.length === 0 && lastGeneratedDate !== todayDateString && medications.length > 0) {
      console.log("[DoseTracker] No reminders found for today, and not marked generated. Attempting to generate new ones...");
      const newlyGeneratedReminders = await generateTodayReminders(); // Call without medications arg, as it fetches internally
      
      // Combine newly generated with existing reminders (from other days or previous runs for this day)
      // Filter out any old reminders that might be for today but are now covered by newly generated ones
      const updatedAllReminders = [
        ...allCurrentStoredReminders.filter(r => r.date !== todayDateString), // Keep reminders from other days
        ...newlyGeneratedReminders // Add the newly generated reminders for today
      ];
      
      saveReminders(updatedAllReminders); // Save the complete, updated list to localStorage
      localStorage.setItem('lastRemindersGeneratedDate', todayDateString); // Mark as generated for today
      
      remindersForToday = newlyGeneratedReminders; // Update the local state for display immediately
    } else if (remindersForToday.length > 0) {
      console.log("[DoseTracker] Reminders for today already exist. Displaying existing ones.");
      // If reminders for today already exist, simply use them
    } else if (medications.length === 0) {
      console.log("[DoseTracker] No medications available to generate reminders from or display.");
      remindersForToday = []; // Ensure empty if no meds
    } else {
      console.log("[DoseTracker] Reminders for today were already generated or no medications available for today.");
    }
    
    setTodayReminders(remindersForToday); // Finally set the state
  };

  const handleMarkTaken = (reminderId: string, medicationName: string) => {
    updateReminderStatus(reminderId, true, false);
    setTodayReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, taken: true, skipped: false }
          : reminder
      )
    );
    
    toast({
      title: "Dose marked as taken",
      description: `${medicationName} has been marked as taken.`,
    });
  };

  const handleMarkSkipped = (reminderId: string, medicationName: string) => {
    updateReminderStatus(reminderId, false, true);
    setTodayReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, taken: false, skipped: true }
          : reminder
      )
    );
    
    toast({
      title: "Dose marked as skipped",
      description: `${medicationName} has been marked as skipped.`,
      variant: "destructive"
    });
  };

  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find(med => med.id === id);
  };

  const getStatusBadge = (reminder: Reminder) => {
    if (reminder.taken) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Taken</Badge>;
    }
    if (reminder.skipped) {
      return <Badge variant="destructive">Skipped</Badge>;
    }
    
    const now = new Date();
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
    
    if (reminderTime <= now) {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">Overdue</Badge>;
    }
    
    return <Badge variant="outline">Pending</Badge>;
  };

  if (todayReminders.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-med-blue-800 dark:text-med-blue-200 flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Today's Doses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No medications scheduled for today.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-med-blue-800 dark:text-med-blue-200 flex items-center">
          <Pill className="mr-2 h-5 w-5" />
          Today's Doses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayReminders.map((reminder) => {
          const medication = getMedicationById(reminder.medicationId);
          if (!medication) return null;

          return (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-med-blue-100 dark:bg-med-blue-800 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-med-blue-600 dark:text-med-blue-300" />
                </div>
                <div>
                  <p className="font-semibold text-med-blue-800 dark:text-med-blue-200">
                    {medication.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {medication.dosage} at {reminder.time}
                  </p>
                  {medication.instruction && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {medication.instruction}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusBadge(reminder)}

                {!reminder.taken && !reminder.skipped && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={() => handleMarkTaken(reminder.id, medication.name)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleMarkSkipped(reminder.id, medication.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          {todayReminders.filter(r => r.taken).length} of {todayReminders.length} doses completed today
        </div>
      </CardContent>
    </Card>
  );
};

export default DoseTracker;
