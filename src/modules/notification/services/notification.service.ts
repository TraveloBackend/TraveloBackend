import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/database/notification.schema';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private firebaseService: FirebaseService,
  ) {}

  async notifyUser(user_id: string, token: string, title: string, body: string, data?: Record<string, any>) {
    await this.firebaseService.sendNotification(token, title, body, data);
    return this.notificationModel.create({ user_id, title, body, data });
  }

  async getUserNotifications(user_id: string) {
    return this.notificationModel.find({ user_id }).sort({ createdAt: -1 });
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { is_read: true }, { new: true });
  }
}