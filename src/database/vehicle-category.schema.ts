import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class VehicleCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  seat_count: number;

  @Prop({ required: true })
  base_fee: number;

  @Prop({ default: 0 })
  per_km_rate: number;

  @Prop({ default: 0 })
  per_min_rate: number;

  @Prop({ default: 0 })
  commission_percentage: number;
}

export const VehicleCategorySchema = SchemaFactory.createForClass(VehicleCategory);

