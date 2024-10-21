import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: "*" })
export class NotificationGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinAdminRoom')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    client.join('admin');
    console.log('Admin user joined the admin room');
  }

  sendNewOrderNotification(orderDetails: any) {
    this.server.to('admin').emit('newOrder', orderDetails); // Send to the "admin" room
  }
}
