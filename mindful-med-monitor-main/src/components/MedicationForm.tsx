
import React, { useState, useEffect } from 'react';
import { Medication } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { generateId } from '@/utils/medicationUtils';
import { useToast } from "@/components/ui/use-toast";

interface MedicationFormProps {
  onSave: (medication: Medication) => void;
  onCancel: () => void;
  initialData?: Medication;
}

const defaultMedication: Medication = {
  id: '',
  name: '',
  dosage: '',
  instruction: '',
  frequency: 'daily',
  reminderTimes: ['08:00'],
  daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  startDate: new Date().toISOString().split('T')[0],
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MedicationForm: React.FC<MedicationFormProps> = ({ onSave, onCancel, initialData }) => {
  const [medication, setMedication] = useState<Medication>(initialData || defaultMedication);
  const [timeInput, setTimeInput] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialData) {
      setMedication(initialData);
    } else {
      setMedication(defaultMedication);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedication((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setMedication((prev) => {
      const isSelected = prev.daysOfWeek.includes(day);
      let updatedDays;
      
      if (isSelected) {
        updatedDays = prev.daysOfWeek.filter((d) => d !== day);
      } else {
        updatedDays = [...prev.daysOfWeek, day];
      }
      
      return { ...prev, daysOfWeek: updatedDays };
    });
  };

  const handleAddTime = () => {
    if (!timeInput || medication.reminderTimes.includes(timeInput)) return;
    
    setMedication((prev) => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, timeInput].sort(),
    }));
    setTimeInput('');
  };

  const handleRemoveTime = (time: string) => {
    setMedication((prev) => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((t) => t !== time),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medication.name || !medication.dosage || medication.reminderTimes.length === 0 || medication.daysOfWeek.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields"
      });
      return;
    }
    
    onSave({
      ...medication,
      id: medication.id || generateId(),
    });
    
    toast({
      title: initialData ? "Medication updated" : "Medication added",
      description: `${medication.name} has been ${initialData ? "updated" : "added"} successfully.`
    });
  };

  return (
    <Card className="w-full animate-fade-in shadow-md">
      <CardHeader className="bg-med-blue-50 dark:bg-med-blue-900/30">
        <CardTitle className="text-med-blue-800 dark:text-med-blue-200">
          {initialData ? 'Edit Medication' : 'Add New Medication'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name *</Label>
            <Input
              id="name"
              name="name"
              value={medication.name}
              onChange={handleChange}
              placeholder="Enter medication name"
              className="focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              name="dosage"
              value={medication.dosage}
              onChange={handleChange}
              placeholder="e.g., 5mg, 1 tablet, 10ml"
              className="focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instruction"
              name="instruction"
              value={medication.instruction}
              onChange={handleChange}
              placeholder="e.g., Take with food, Take on empty stomach"
              className="focus-ring min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time(s) *</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="focus-ring"
              />
              <Button 
                type="button" 
                onClick={handleAddTime}
                className="bg-med-blue-600 hover:bg-med-blue-700"
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {medication.reminderTimes.map((time) => (
                <div 
                  key={time} 
                  className="bg-med-blue-100 text-med-blue-800 px-3 py-1 rounded-full flex items-center gap-2 dark:bg-med-blue-800 dark:text-med-blue-100"
                >
                  {time}
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(time)}
                    className="text-med-blue-800 hover:text-med-blue-900 dark:text-med-blue-100 dark:hover:text-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Days of Week *</Label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
              {weekdays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={medication.daysOfWeek.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                    className="data-[state=checked]:bg-med-blue-600"
                  />
                  <label
                    htmlFor={day}
                    className="text-sm font-medium leading-none capitalize cursor-pointer"
                  >
                    {day.slice(0, 3)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={medication.startDate}
              onChange={handleChange}
              className="focus-ring"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4 pb-4 bg-gray-50 dark:bg-gray-800/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="focus-ring"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-med-blue-600 hover:bg-med-blue-700 focus-ring"
          >
            {initialData ? 'Update Medication' : 'Add Medication'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MedicationForm;
