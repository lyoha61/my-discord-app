import { Logger, UseGuards } from '@nestjs/common';
import {
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import type {
	ClientMessagePayload,
	ClientUpdateMessagePayload,
} from 'shared/types/message';
import { SocketAuth } from 'shared/types/auth';
import { JwtService } from '@nestjs/jwt';
import { EVENTS, USER_STATUS } from 'shared/events';
import type { ChatSocket } from './types/socket';
import {
	mapMessageToClient,
	mapUpdatedMessageToClient,
} from 'shared/utils/messageMapper';

interface JwtPayload {
	sub: number;
	iat?: number;
	exp?: number;
}

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(ChatGateway.name);
	private onlineUsers = new Map<number, string>();

	constructor(
		private readonly messageService: MessageService,
		private readonly jwtService: JwtService,
	) {}

	afterInit() {
		this.logger.log('WebSocket Server Initialized', { userId: 3 });
	}

	handleConnection(client: ChatSocket) {
		const authData = client.handshake.auth as SocketAuth;
		if (!authData.access_token) {
			client.disconnect(true);
			this.logger.error(`Access token is missing Client: ${client.id}`);
			return;
		}

		try {
			const payload = this.jwtService.verify<JwtPayload>(authData.access_token);
			client.data.user = { id: payload.sub };
			this.onlineUsers.set(payload.sub, client.id);

			this.logger.log(`Client connected: ${client.id}`);

			this.server.emit(EVENTS.USER_STATUS_CHANGED, {
				userId: payload.sub,
				status: USER_STATUS.ONLINE,
			});

			const onlineUsersIds = Array.from(this.onlineUsers.keys());
			client.emit(EVENTS.ONLINE_USER_LIST, onlineUsersIds);
		} catch (err: unknown) {
			client.disconnect();
			if (err instanceof Error) {
				this.logger.error(
					`Invalid or expired token. Client ${client.id}, reason: ${err.message}`,
				);
			} else {
				this.logger.error(
					`Invalid or expired token. Client ${client.id}, reason: ${String(err)}`,
				);
			}
		}
	}

	handleDisconnect(client: ChatSocket) {
		if (!client.data.user) return;

		const userId = client.data.user.id;
		this.onlineUsers.delete(userId);

		this.logger.log(`Client disconnected ${client.id}`);

		this.server.emit(EVENTS.USER_STATUS_CHANGED, {
			userId,
			status: USER_STATUS.OFFLINE,
		});
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage(EVENTS.MESSAGE_NEW)
	async handleNewMessage(
		client: ChatSocket,
		payload: ClientMessagePayload,
	): Promise<void> {
		try {
			const msg = await this.messageService.storeMessage(
				payload.text,
				client.data.user.id,
				payload.chat_id,
			);

			const formattedMessage = mapMessageToClient(msg);

			this.server.emit(EVENTS.MESSAGE_NEW, {
				clientId: client.id,
				...formattedMessage,
			});
		} catch (err) {
			this.logger.error(`Error on event "${EVENTS.MESSAGE_NEW}"`);
			throw err;
		}
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage(EVENTS.MESSAGE_UPDATE)
	async handleUpdateMessage(
		client: ChatSocket,
		payload: ClientUpdateMessagePayload,
	): Promise<void> {
		const updatedMsg = await this.messageService.updateMessage(
			payload.text,
			payload.message_id,
			client.data.user.id,
			payload.chat_id,
		);

		const formattedMessage = mapUpdatedMessageToClient(updatedMsg);

		this.logger.log({
			event: EVENTS.MESSAGE_UPDATE,
			userId: client.data.user.id,
			messageId: payload.message_id,
			chatId: payload.chat_id,
			newText: payload.text,
		});

		this.server.emit(EVENTS.MESSAGE_UPDATE, {
			clientId: client.id,
			...formattedMessage,
		});
	}
}
