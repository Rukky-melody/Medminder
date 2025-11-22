import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicationList from '@/components/MedicationList';
import MedicationForm from '@/components/MedicationForm';
import ReminderSettings from '@/components/ReminderSettings';
import DoseTracker from '@/components/DoseTracker';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CalendarClock, AlertCircle } from 'lucide-react';
import { Medication, Reminder } from '@/types';
import {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  getReminders,
  getUpcomingReminders
} from '@/utils/medicationUtils'; // Assuming medicationUtils now throws errors with a 'message' property
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('medications');
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper to extract message from error object, assuming it's an Error instance
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    // Fallback for non-Error objects that might be thrown
    return "An unknown error occurred.";
  };

  // Get medications using React Query
  const { data: medications = [], isLoading, error } = useQuery({
    queryKey: ['medications'],
    queryFn: getMedications
  });

  // Set up mutations for add, update, delete
  const addMedicationMutation = useMutation({
    mutationFn: addMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication added",
        description: "The medication has been added to your list.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to add medication",
        description: getErrorMessage(error), // Use extracted error message
      });
      console.error('Add medication error:', error);
    }
  });

  const updateMedicationMutation = useMutation({
    mutationFn: updateMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication updated",
        description: "The medication has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update medication",
        description: getErrorMessage(error), // Use extracted error message
      });
      console.error('Update medication error:', error);
    }
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication deleted",
        description: "The medication has been removed from your list.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete medication",
        description: getErrorMessage(error), // Use extracted error message
      });
      console.error('Delete medication error:', error);
    }
  });

  // Load medications on mount and set up reminder refresh
  useEffect(() => {
    refreshUpcomingReminders();

    const intervalId = setInterval(refreshUpcomingReminders, 60000); // Every minute

    return () => clearInterval(intervalId);
  }, []);

  const refreshUpcomingReminders = () => {
    // getUpcomingReminders and getReminders are client-side and should not throw API errors.
    // If they were to fail, it's typically due to local storage issues,
    // and the `medicationUtils` already handles logging/re-throwing those.
    try {
      const upcoming = getUpcomingReminders();
      setUpcomingReminders(upcoming);
    } catch (e) {
      console.error("Error refreshing upcoming reminders:", e);
      toast({
        variant: "destructive",
        title: "Reminder loading error",
        description: "Could not load upcoming reminders. Please check your browser's local storage.",
      });
    }
  };

  const handleSaveMedication = (medication: Medication) => {
    const isEditing = !!editingMedication;

    if (isEditing) {
      updateMedicationMutation.mutate(medication);
    } else {
      addMedicationMutation.mutate(medication);
    }

    setIsFormOpen(false);
    setEditingMedication(undefined);
    // Refresh upcoming reminders after a potential add/update, as it might affect them
    refreshUpcomingReminders();
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setIsFormOpen(true);
  };

  const handleDeleteMedication = (id: string) => {
    deleteMedicationMutation.mutate(id);
    // Refresh upcoming reminders after deletion, as it might affect them
    refreshUpcomingReminders();
  };

  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find(med => med.id === id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-med-blue-800 dark:text-med-blue-200 md:text-left">
          Medication Reminder System
        </h1>

        {isLoading && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Loading medications...
            </AlertDescription>
          </Alert>
        )}

        {/* Display error message from React Query's useQuery */}
        {error && (
          <Alert className="mb-6 bg-destructive/10 dark:bg-destructive/20 border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Error loading medications: {getErrorMessage(error)}
            </AlertDescription>
          </Alert>
        )}

        {/* Add DoseTracker component */}
        <div className="mb-8">
          <DoseTracker medications={medications} />
        </div>

        {upcomingReminders.length > 0 && (
          <Card className="mb-8 animate-fade-in border-med-blue-200 dark:border-med-blue-800">
            <CardHeader className="bg-med-blue-50 dark:bg-med-blue-900/30 pb-3">
              <CardTitle className="text-med-blue-800 dark:text-med-blue-200 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-3">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingReminders.slice(0, 3).map((reminder) => {
                  const medication = getMedicationById(reminder.medicationId);
                  if (!medication) return null;

                  return (
                    <div
                      key={reminder.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-med-blue-100 dark:border-med-blue-800 shadow-sm flex items-start gap-3"
                    >
                      <div className="bg-med-blue-100 dark:bg-med-blue-800 p-2 rounded-full">
                        <CalendarClock className="h-5 w-5 text-med-blue-600 dark:text-med-blue-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-med-blue-800 dark:text-med-blue-200">{medication.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{medication.dosage}</p>
                        <p className="text-med-blue-600 dark:text-med-blue-300 font-medium mt-1">{reminder.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {upcomingReminders.length > 3 && (
                <p className="text-sm text-med-blue-600 dark:text-med-blue-400 mt-3 text-center">
                  +{upcomingReminders.length - 3} more reminders today
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
            <TabsTrigger value="tracker">Today's Doses</TabsTrigger>
            <TabsTrigger value="medications">My Medications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker">
            <DoseTracker medications={medications} />
          </TabsContent>

          <TabsContent value="medications">
            <div className="space-y-6">
              {isFormOpen ? (
                <MedicationForm
                  onSave={handleSaveMedication}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingMedication(undefined);
                  }}
                  initialData={editingMedication}
                />
              ) : (
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-med-blue-800 dark:text-med-blue-200">
                    {medications.length === 0 && !isLoading ? 'Add Your First Medication' : 'Your Medications'}
                  </h2>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-med-blue-600 hover:bg-med-blue-700 focus-ring"
                  >
                    Add Medication
                  </Button>
                </div>
              )}

              <MedicationList
                medications={medications}
                onEdit={handleEditMedication}
                onDelete={handleDeleteMedication}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <h2 className="text-2xl font-bold mb-6 text-med-blue-800 dark:text-med-blue-200">Notification Preferences</h2>
            <ReminderSettings />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Index;