
import React from 'react';
import { Medication } from '@/types';
import MedicationCard from './MedicationCard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicationListProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onEdit, onDelete, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="pt-4 flex justify-between">
              <Skeleton className="h-8 w-16" />
              <div className="space-x-2">
                <Skeleton className="h-8 w-16 inline-block" />
                <Skeleton className="h-8 w-16 inline-block" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <Alert className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No medications found. Add your first medication using the form above.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
      {medications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MedicationList;
