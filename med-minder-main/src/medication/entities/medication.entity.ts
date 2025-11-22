import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{  Document, Types} from "mongoose";


export type MedicationDocument = Medication & Document;

@Schema()
export class Medication {
  @Prop({type: String, required: true, index: true})
  id: string;

  @Prop({ required: true , index: true})
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ required: true })
  instruction: string;

  @Prop({ type: [String], required: true }) // e.g., ["08:00", "14:00"]
  reminderTimes: string[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: [String], required: true }) // e.g., ["Monday", "Tuesday"]
  daysOfWeek: string[];

  @Prop({ default: false })
  notifiedToday: boolean;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);