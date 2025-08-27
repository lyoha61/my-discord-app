import { Logger } from '@nestjs/common';
import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { timestamp } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Server Initialized');
  }
  
  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('message', {
      id: client.id,
      text: payload.text,
      timestamp: new Date().toISOString()
    });
  }

}
