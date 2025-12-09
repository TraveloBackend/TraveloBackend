import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../config/firebase/habbit-time-firebase.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
  }

  async sendNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      data: data || {},
    };
    return await admin.messaging().send(message);
  }
}