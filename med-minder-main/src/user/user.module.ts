import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { SmsModule } from 'src/sms/sms.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.register({
          secret: process.env.EMAIL_SECRET || 'supersecretkey',
          signOptions: { expiresIn: "1h"},
        }),
    forwardRef(() => MailModule),
    forwardRef(() => SmsModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
