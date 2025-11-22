import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Gmail SMTP server
        port: 465,              // SSL port
        secure: true,           // True for port 465
        auth: {
          user: process.env.GMAIL_USER, // Your Gmail address (e.g., example@gmail.com)
          pass: process.env.GMAIL_PASS, // App password or Gmail password
        },
      },
      defaults: {
        from: '"Med-Minder" <luckyblaqy@mail.com@gmail.com>', // Replace with your Gmail address
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
