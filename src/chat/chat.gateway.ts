import { Logger, UseGuards } from '@nestjs/common';
import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { timestamp } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import type { ClientMessage, ClientMessagePayload, MessageEvent } from 'shared/types/message';

import { SocketAuth } from 'shared/types/auth';

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
    const authData = client.handshake.auth as SocketAuth;
    if (!authData.access_token) {
      client.disconnect(true);
      this.logger.error(`Access token is missing Client: ${client.id}`)
      return
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: ClientMessagePayload): Promise<void> {
    try{
      const userId = client.data.user.id;

      const message = await this.messageService.storeMessage(
        payload.text,
        userId,
        payload.chat_id
      );

      const formattedMessage: ClientMessage = {
        ...message,
        created_at: message.created_at.toISOString(),
        updated_at: message.updated_at.toISOString()
      }

      const eventPayload: MessageEvent = {
        client_id: client.id,
        ...formattedMessage
      }

      this.server.emit('message', eventPayload);
    } catch(err) {
      this.logger.error('Error on event "message"');
      throw err;
    }
  }

}
