import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async emailMedicationReminder(to: string, time: string, currentDay: string, medicationName: string, dose: string) {
    try {
      const email = await this.mailerService.sendMail({
        to,
        subject: 'Medication Reminder',
        text: 'Please take your medication now.',
        html: `
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Day:</strong> ${currentDay}</p>
          <p><strong>Medication Name:</strong> <span style="color:blue;">${medicationName}</span></p>
          <p><strong>Dose:</strong> <span style="color:blue;">${dose}</span></p>
          <p>Stay consistent and healthy!</p>
        `,
      });

      if (!email) {
        throw new HttpException('Failed to send medication reminder.', HttpStatus.EXPECTATION_FAILED);
      }
      return email;
    } catch (error) {
      throw new HttpException(error.message || 'Email sending failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendEmailVerification(to: string, url: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Email Verification',
        text: 'Please verify your email.',
        html: `
          <h2>Hello ${name},</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${url}">Verify My Email</a>
          <p>This link will expire in 1 hour.</p>
        `,
      });
    } catch (error) {
      throw new HttpException(error.message || 'Email sending failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendPasswordReset(to: string, url: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password',
        text: 'Click the link to reset your password.',
        html: `
          <h2>Hello ${name},</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      });
    } catch (error) {
      throw new HttpException(error.message || 'Email sending failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Optional default methods
  findAll() {
    return 'This action returns all mail';
  }

  findOne(id: number) {
    return `This action returns mail #${id}`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates mail #${id}`;
  }

  remove(id: number) {
    return `This action removes mail #${id}`;
  }
}
