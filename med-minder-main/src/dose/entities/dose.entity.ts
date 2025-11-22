import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{  Document, Types} from "mongoose";
import { Medication } from "src/medication/entities/medication.entity";

export type DoseDocument = Dose & Document;

@Schema()
export class Dose {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Medication' })
  medicationId: Medication;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ enum: ['pending', 'taken', 'skipped'], default: 'pending' })
  status: string;
}

export const DoseSchema = SchemaFactory.createForClass(Dose);
