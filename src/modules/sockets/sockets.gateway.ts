import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RideService } from "../ride/ride.service";
import { ChatService } from "../chat/chat.service";

@WebSocketGateway({ cors: true })
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly rideService: RideService,
    private readonly chatService: ChatService
  ) {}

  private onlineUsers: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    let userSockets = this.onlineUsers.get(userId);

    if (!userSockets) {
      userSockets = new Set<string>();
      this.onlineUsers.set(userId, userSockets);
    }

    userSockets.add(client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.onlineUsers.get(userId)?.delete(client.id);
    if (this.onlineUsers.get(userId)?.size === 0)
      this.onlineUsers.delete(userId);
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: string;
      senderId: string;
      receiverId: string;
      message: string;
    }
  ) {
    // Save message in DB
    const chat = await this.chatService.saveMessage(data);

    // Send to all online devices of the receiver
    const receiverSockets = this.onlineUsers.get(data.receiverId);
    if (receiverSockets) {
      for (const socketId of receiverSockets) {
        this.server.to(socketId).emit("receive_message", chat);
      }
    }

    // Also emit to sender devices (so multiple devices see it)
    const senderSockets = this.onlineUsers.get(data.senderId);
    if (senderSockets) {
      for (const socketId of senderSockets) {
        this.server.to(socketId).emit("receive_message", chat);
      }
    }
  }

  @SubscribeMessage("request_ride")
  async handleRideRequest(
    @MessageBody() data: { riderId: string; pickup: string; drop: string },
    @ConnectedSocket() client: Socket
  ) {
    const ride = await this.rideService.createRideRequest(
      data.riderId,
      data.pickup,
      data.drop
    );

    // Notify available drivers
    this.server.emit("new_ride", ride);

    // Respond to rider
    client.emit("ride_requested", ride);
  }

  @SubscribeMessage("accept_ride")
  async handleAcceptRide(
    @MessageBody() data: { rideId: string; driverId: string }
  ) {
    const ride = await this.rideService.acceptRide(data.rideId, data.driverId);

    // Notify rider
    this.server.to(data.rideId).emit("ride_accepted", ride);

    // Broadcast driver info if needed
    this.server.emit("ride_assigned", ride);
  }

  @SubscribeMessage("update_ride_charges")
  async handleUpdateCharges(
    @MessageBody() data: { rideId: string; newAmount: number }
  ) {
    const updated = await this.rideService.updateRideCharges(
      data.rideId,
      data.newAmount
    );
    this.server.emit("ride_charges_updated", updated);
  }

  @SubscribeMessage("complete_ride")
  async handleCompleteRide(
    @MessageBody()
    data: {
      rideId: string;
      driverId: string;
      driverAmount: number;
    }
  ) {
    const result = await this.rideService.completeRide(
      data.rideId,
      data.driverId,
      data.driverAmount
    );
    this.server.emit("ride_completed", result);
  }
}
