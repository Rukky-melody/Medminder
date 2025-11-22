import { Module } from '@nestjs/common';
import { DoseService } from './dose.service';
import { DoseController } from './dose.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dose, DoseSchema } from './entities/dose.entity';
import { MedicationModule } from 'src/medication/medication.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Dose.name, schema: DoseSchema}]),
  ],
  controllers: [DoseController],
  providers: [DoseService],
  exports: [DoseService]
})
export class DoseModule {}
