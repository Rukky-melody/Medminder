import { IsString, IsNotEmpty } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  to: string; // phone number in international format e.g., 234...

  @IsString()
  @IsNotEmpty()
  message: string;
}