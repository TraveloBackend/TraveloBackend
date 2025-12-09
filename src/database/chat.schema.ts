import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiver_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    date: string;

    @Prop({ default: false })
    is_read: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.virtual('sender', {
    ref: 'User',
    localField: 'sender_id',
    foreignField: '_id',
});

ChatSchema.virtual('receiver', {
    ref: 'User',
    localField: 'receiver_id',
    foreignField: '_id',
});

ChatSchema.set('toObject', { virtuals: true });
ChatSchema.set('toJSON', { virtuals: true });