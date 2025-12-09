// vehicle.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VehicleCategory } from './vehicle-category.schema';

@Schema({ timestamps: true })
export class Vehicle extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: VehicleCategory.name, required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  plate_number: string;

@Prop()
  vehicle_model: string;

  @Prop()
  make: string;

  @Prop()
  year: string;

  @Prop()
  applied_fee: number;

  @Prop()
  seat_count: number;

  @Prop()
  is_verified: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);