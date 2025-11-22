import { PartialType } from '@nestjs/swagger';
import { CreateDoseDto } from './create-dose.dto';

export class UpdateDoseDto extends PartialType(CreateDoseDto) {}
