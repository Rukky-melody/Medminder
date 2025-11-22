import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  dosage: string;
  
  @IsOptional()
  @IsString()
  instruction: string;

  @IsOptional()
  @IsArray()
  reminderTimes?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsArray()
  daysOfWeek?: string[];
}
