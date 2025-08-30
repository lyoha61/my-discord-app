import { Logger, UseGuards } from '@nestjs/common';
import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { timestamp } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly messageService: MessageService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Server Initialized');
  }
  
  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    try{
      const userId = client.data.user.id;
      const savedMessage = await this.messageService.storeMessage(
        payload.text,
        userId,
        payload.chatId
      );

      this.server.emit('message', {
        clientId: client.id,
        text: payload.text,
        timestamp: new Date().toISOString(),
        author_id: savedMessage.author_id
      });
    } catch(err) {
      this.logger.error('Error on event "message"');
      throw err;
    }
  }

}
