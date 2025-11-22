// src/medication/medication.service.ts
import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import mongoose, { Model } from 'mongoose';
import { Medication,MedicationDocument } from './entities/medication.entity';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { SmsService } from 'src/sms/sms.service';
import { DoseService } from 'src/dose/dose.service';

@Injectable()
export class MedicationService implements OnModuleInit {
  constructor(
    @InjectModel(Medication.name)
    private medModel: Model<MedicationDocument>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly doseService: DoseService,
    private readonly smsService: SmsService
  ) {}

  async onModuleInit() {
    await this.medModel.syncIndexes(); // Ensures indexes are synchronized
  }

  async addMedication(medDto:CreateMedicationDto,userId:string): Promise<Medication>{
    try {
      const {
        name,
        dosage,
        instruction, 
        reminderTimes, 
        startDate, 
        daysOfWeek, 
        } = medDto;
        const med = new this.medModel({
          id: uuidv4(),
          userId:userId,
          name: name,
          dosage: dosage,
          instruction: instruction,
          reminderTimes: reminderTimes,
          startDate: startDate,
          daysOfWeek: daysOfWeek
        });
        const saveMed = await med.save();
        const medId: string = String(saveMed._id);
        
        await this.userService.pushMedication(userId, medId);
        return saveMed;
      
    } catch (error) {
      // Re-throw specific HTTP exceptions or log and throw generic error
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error adding medication:', error);
      throw new HttpException('Failed to add medication', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:mm
      const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
  
      const meds = await this.medModel.find({
        startDate: { $lte: now },
        daysOfWeek: currentDay,
      });

      

      for (const med of meds) {
        if (med.reminderTimes.includes(currentTime)) {
          console.log(`⏰ Processing reminder for ${med.name} (${med.dosage}) at ${currentTime} on ${currentDay}`);
          
          const user = await this.userService.findOne(med.userId);
          if(!user){
            console.warn(`User with ID ${med.userId} not found for medication ${med.name}. Skipping reminder.`);
            continue; // Skip to the next medication if user is not found
          }

          // --- Improved Error Handling for External Services ---
          // Email Notification
          try {
            await this.mailService.emailMedicationReminder(user.email, currentTime, currentDay, med.name, med.dosage);
            console.log(`📧 Email reminder sent for ${med.name} to ${user.email}`);
          } catch (mailError) {
            console.error(`🚨 Failed to send email reminder for ${med.name} to ${user.email}:`, mailError);
            // Decide if you want to continue or skip SMS/dose creation based on email failure
            // For now, we'll log and continue to try SMS and dose creation
          }

          // SMS Notification
          try {
            const message = `MediReminder: Time: ${currentTime} \n Day: ${currentDay} \n Medication: ${med.name} \n Dose: ${med.dosage}`;
            await this.smsService.sendSms(user.phoneNumber, message);
            console.log(`📱 SMS reminder sent for ${med.name} to ${user.phoneNumber}`);
          } catch (smsError) {
            console.error(`🚨 Failed to send SMS reminder for ${med.name} to ${user.phoneNumber}:`, smsError);
          }
          // --- End of Improved Error Handling ---

          // Create a dose entry for tracking
          try {
            const medId: string = String(med._id);
            const medicationObjectId = new mongoose.Types.ObjectId(medId);
            await this.doseService.create(medicationObjectId, med.userId, now, "pending");
            console.log(`💊 Dose entry created for ${med.name}`);
          } catch (doseError) {
            console.error(`🚨 Failed to create dose entry for ${med.name}:`, doseError);
          }
        }
      }
    } catch (mainError) {
      console.error('Unhandled error in checkReminders cron job:', mainError);
      // Do NOT re-throw here, as it would halt the NestJS scheduler permanently.
      // Log the error and let the scheduler continue for the next interval.
    }
  }

  async findAllMedicationsByUser(userId:string): Promise<Medication[]>{
    try {
      return await this.medModel.find({userId:userId});
    } catch (error) {
      console.error('Error finding medications by user:', error);
      throw new HttpException('Failed to retrieve medications', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateMedication(userId: string, id: string, data: UpdateMedicationDto) {
    const medication = await this.medModel.findOneAndUpdate(
      { id: id, userId: userId },
      { $set: data },
      { new: true },
    );
    if (!medication) {
      throw new NotFoundException('Medication not found or unauthorized');
    }
    return medication;
  }

  async deleteMedication(userId: string, id: string) {
    const deleted = await this.medModel.findOneAndDelete({
      id: id,
      userId: userId,
    });
    if (!deleted) {
      throw new NotFoundException('Medication not found or unauthorized');
    }
    return { message: 'Medication deleted successfully' };
  }

  // Keeping placeholder methods, consider removing if not used
  findAll() {
    return `This action returns all medication`;
  }
  findOne(id: number) {
    return `This action returns a #${id} medication`;
  }
  update(id: number, updateMedicationDto: UpdateMedicationDto) {
    return `This action updates a #${id} medication`;
  }
  remove(id: number) {
    return `This action removes a #${id} medication`;
  }
}
