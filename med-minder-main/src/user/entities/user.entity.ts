import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{  Document, Types} from "mongoose";


export type UserDocument = User & Document;


@Schema({timestamps: true})
export class User {
    @Prop({type: String, required: true, index: true})
    id: string;
    
    @Prop({type: String, required: true})
    fullName: string;

    @Prop({type: String, required: true, index: true, unique: true})
    email: string;

    @Prop({type: String})
    phoneNumber: string

    @Prop({type: String, required: true, index: true})
    password: string;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop({type: Number, default: null})
    resetPasswordToken: number;
  
    @Prop({type: Date, default: null})
    resetPasswordExpires: Date;

    @Prop({type: Date})
    DOB: Date;

    @Prop({type: String, required: true})
    gender: string;

    

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: "Medication"}])
    medications: Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);
