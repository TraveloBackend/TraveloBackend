// src/notifications/notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/database/notification.schema';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseService],
  exports: [NotificationService, MongooseModule, FirebaseService],
})
export class NotificationModule {}