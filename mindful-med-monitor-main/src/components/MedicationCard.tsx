
import React from 'react';
import { Clock, Calendar as CalendarIcon, Pill } from 'lucide-react';
import { Medication } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchDrugInfo } from '@/utils/medicationUtils';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onEdit, onDelete }) => {
  const { id, name, dosage, instruction, frequency, reminderTimes, daysOfWeek } = medication;

  const handleInfoLookup = async () => {
    const url = await searchDrugInfo(name);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <CardHeader className="bg-med-blue-50 dark:bg-med-blue-900/30">
        <div className="flex justify-between items-start">
          <CardTitle className="text-med-blue-800 dark:text-med-blue-200">{name}</CardTitle>
          <Badge variant="outline" className="bg-med-blue-100 text-med-blue-700 dark:bg-med-blue-800 dark:text-med-blue-100">
            {dosage}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <Pill className="h-5 w-5 text-med-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{instruction}</p>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-med-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Times:</p>
              <div className="flex flex-wrap gap-1">
                {reminderTimes.map((time, index) => (
                  <Badge key={index} variant="secondary" className="bg-med-green-50 text-med-green-700 dark:bg-med-green-900/30 dark:text-med-green-200">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CalendarIcon className="h-5 w-5 text-med-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Days:</p>
              <div className="flex flex-wrap gap-1">
                {daysOfWeek.map((day, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(medication)}
          className="text-med-blue-600 hover:text-med-blue-800 hover:bg-med-blue-50 dark:hover:bg-med-blue-900/30"
        >
          Edit
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInfoLookup}
            className="text-med-blue-600 hover:text-med-blue-800 hover:bg-med-blue-50 dark:hover:bg-med-blue-900/30"
          >
            Info
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(id)}
            className="text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
