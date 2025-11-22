import { IsArray, IsDateString, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  instruction: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  reminderTimes: string[]; // e.g., ["08:00", "20:00"]

  @IsNotEmpty()
  @IsDateString()
  startDate: string; // ISO date

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  daysOfWeek: string[]; // e.g., ["Monday", "Wednesday"]
}
