import { forwardRef, Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medication, MedicationSchema } from './entities/medication.entity';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from 'src/mail/mail.module';
import { DoseModule } from 'src/dose/dose.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Medication.name, schema: MedicationSchema}]),
    ScheduleModule.forRoot(),
    MailModule,
    forwardRef(() => DoseModule),
    forwardRef(() => UserModule),
    forwardRef(() => SmsModule),
  ],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports:[MedicationService]
})
export class MedicationModule {}
