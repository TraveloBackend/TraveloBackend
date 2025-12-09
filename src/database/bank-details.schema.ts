import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BankDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  bank_name: string;

  @Prop({ required: true })
  account_holder_name: string;

  @Prop({ required: true })
  account_number: string;

  @Prop({ required: true })
  routing_number: string;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);
