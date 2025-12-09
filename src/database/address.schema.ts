import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
    @Prop({ required: true, min: 1, max: 100 })
    name: string;

    @Prop({ required: true, min: 1, max: 100 })
    type: string;

    @Prop({ required: true })
    latitude: string;

    @Prop({ required: true })
    longitude: string;

    @Prop({ required: true })
    user_id: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);