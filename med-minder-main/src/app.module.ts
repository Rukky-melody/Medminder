import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicationModule } from './medication/medication.module';
import { DoseModule } from './dose/dose.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import 'dotenv/config';

const mongoUri = process.env.MONGODB_CONNECT;

if (!mongoUri) {
  // This will prevent the application from starting if the URI is missing
  throw new Error('MONGODB_URI environment variable is not set. Please check your .env file.');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    UserModule,
    forwardRef(() => AuthModule),
    forwardRef(() => MedicationModule),
    forwardRef(() => DoseModule),
    forwardRef(() => MailModule),
    forwardRef(() => SmsModule)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
