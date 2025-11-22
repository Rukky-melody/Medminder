import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthDTO, UserVerifyeDTO } from 'src/auth/dto/auth.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { SmsService } from 'src/sms/sms.service';
import { AuthService } from 'src/auth/auth.service';
import { error } from 'console';

@Injectable()
export class UserService implements OnModuleInit{
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly mailService: MailService, 
  private readonly jwtService: JwtService,
  private readonly smsService: SmsService,
) {}

async onModuleInit() {
  await this.userModel.syncIndexes(); // Ensures indexes are synchronized
}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const {
        fullName,  
        email, 
        phoneNumber, 
        password, 
        DOB,
        gender, 
        } = createUserDto;
      
      const hashPassword : string = await bcrypt.hash(password, 12);
      

      const tokenSign = this.jwtService.sign(
        { email: email },
      );

       const dateObject = new Date(DOB);

      const userData = new this.userModel({
        id: uuidv4(),
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: hashPassword,
        DOB: dateObject,
        gender: gender
      });

      const url = `${process.env.APP_URL}/verify-email?token=${tokenSign}`;

        
        const sendVerificationEmail:any = await this.mailService.sendEmailVerification(userData.email, url, userData.fullName);

         return await userData.save();
        

       //await this.smsService.sendSms(phoneNumber,"this is me testing my app");
      
    
       
    } catch (error) {
      throw error;
    }
  }

  async resendVerification(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');
      if (user.isEmailVerified) return { message: 'Email is already verified.' };
    
      const token = this.jwtService.sign(
        { email: user.email }
      );
    
    
      const url = `${process.env.APP_URL}/verify-email?token=${token}`;
  
        
  
      await this.mailService.sendEmailVerification(user.email, url, user.fullName);
       
    } catch (error) {
      throw error;
    }
   
 }

  


 async verifyEmail(token: string) {
  try {
    const payload = this.jwtService.verify(token, { secret: process.env.JWT_EMAIL_SECRET });
    const user = await this.userModel.findOne({ email: payload.email });
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) return { message: 'Email already verified.' };

    user.isEmailVerified = true;
    await user.save();
    return { message: 'Email verified successfully.' };
  } catch (e) {
    throw new BadRequestException('Invalid or expired token');
  }
}


  async pushMedication(userId: string, MedicationId: string){
    try {
      const push = await this.userModel.updateOne({_id: userId}, {$push: {medications: MedicationId}});

      if(!push){
        throw new HttpException('unable', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }


  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign({ email: user.email }, {
      secret: process.env.JWT_RESET_SECRET,
      expiresIn: '15m',
    });

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`; // or frontend URL

    await this.mailService.sendPasswordReset(user.email,resetUrl,user.fullName);

    return { message: 'Password reset link sent to your email.' };
  }
  async resetPassword(dto: ResetPasswordDto, token:string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET,
      });

      const user = await this.userModel.findOne({ email: payload.email });
      if (!user) throw new NotFoundException('User not found');

      user.password = await bcrypt.hash(dto.newPassword, 12);
      await user.save();

      return { message: 'Password reset successfully.' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired reset token.');
    }
  }

  findAll() {
    return `This action returns all user`;
  }


  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if(!user){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }

  
  }

  async findOneUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({id:id})
      .select("-password")
      .populate("medications",["name","lastName"])
      .exec();

      if(!user){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUser(data: AuthDTO): Promise<any> {
    try {
      const user = await this.userModel.findOne({email: data.email})
      .populate("medications")
      .exec();
      if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        
      return user;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
