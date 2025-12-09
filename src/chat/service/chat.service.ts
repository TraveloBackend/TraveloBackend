import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/database/chat.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>
    ) { }

    async saveMessage(data: { sender_id: string; receiver_id: string; message: string, date: string }) {
        const message = this.chatModel.create([data]);
        return message;
    }

    async getMessages(userId1: string, userId2: string) {
        return await this.chatModel.find({
            $or: [
                { sender_id: userId1, receiver_id: userId2 },
                { sender_id: userId2, receiver_id: userId1 },
            ],
        }).sort({ date: 1 });
    }
}
