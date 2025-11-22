import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoseDto } from './dto/create-dose.dto';
import { UpdateDoseDto } from './dto/update-dose.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dose, DoseDocument } from './entities/dose.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class DoseService {
  constructor(@InjectModel(Dose.name)
      private doseModel: Model<DoseDocument>,){}
  async create(medicationId: mongoose.Types.ObjectId, userId:string,scheduleTime:any, status:string ="pending") {
    try {
      const newDose = new this.doseModel({
        medicationId:medicationId,
        userId: userId,
        scheduledTime: scheduleTime,
        status: status,
      });

        const dose = newDose.save();
        if(!dose){
          throw new HttpException("unable to add dose",HttpStatus.BAD_REQUEST)
        }
    } catch (error) {
      throw error;
    }
    


  }

  findAll() {
    return `This action returns all dose`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dose`;
  }

  async updateStatus(id: string, status:string) {
    return await this.doseModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} dose`;
  }
}
