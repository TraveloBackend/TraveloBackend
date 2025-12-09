import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../service/chat.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { UserService } from 'src/modules/users/services/user.service';

@WebSocketGateway(3001, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { sender_id: string; receiver_id: string; message: string, date: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.chatService.saveMessage(data);
    const receiver: any = await this.userService.findUser({ _id: data.receiver_id });
    const sender: any = await this.userService.findUser({ _id: data.sender_id });

    client.emit(`receive_message_${data.receiver_id}`, saved);
    if (receiver.is_notify && receiver.fcm_token) {
      this.notificationService.notifyUser(data.receiver_id, receiver.fcm_token, 'New Message Notification', `${sender.first_name} has sent you a message`, saved);
    }
    return saved;
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @MessageBody() data: { user1: string; user2: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessages(data.user1, data.user2);
    return messages;
  }
}
