import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true })
    user_id: string;

    title: string;

    body: string;

    @Prop({ type: Object })
    data: Record<string, any>;

    @Prop({ default: false })
    is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
