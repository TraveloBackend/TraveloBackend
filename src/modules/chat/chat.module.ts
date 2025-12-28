import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/database/chat.schema';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { Notification, NotificationSchema } from 'src/database/notification.schema';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/modules/users/services/user.service';
import { User, UserSchema } from 'src/database/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [ChatGateway,ChatService, NotificationService, FirebaseService, UserService],
      exports: [MongooseModule]
})
export class ChatModule {}
