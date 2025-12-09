import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
    @Prop({ required: true, min: 1, max: 100 })
    name: string;

    @Prop({ required: true, min: 1, max: 200 })
    slug: string;

    @Prop({ required: true, min: 1, max: 5000 })
    description: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);