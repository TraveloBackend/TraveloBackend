import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RiderType extends Document {
  @Prop({ required: true, min: 1 })
  seat_count: number;

  @Prop({ required: true, min: 0 })
  base_fee: number;
}

export const RiderTypeSchema =
  SchemaFactory.createForClass(RiderType);