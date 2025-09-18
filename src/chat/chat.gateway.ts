import { Logger, UseGuards } from '@nestjs/common';
import {
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { SocketAuth } from 'shared/types/auth';
import { JwtService } from '@nestjs/jwt';
import { ClientToServerEvents, EVENTS, ServerToClientEvents, USER_STATUS } from 'shared/types/websocket/events';
import {
	mapMessageToClient,
	mapUpdatedMessageToClient,
} from 'shared/utils/messageMapper';
import type { WsMessageBase, WsMessageNew, WsMessageUpdate } from 'shared/types/websocket/message';

interface JwtPayload {
	sub: number;
	iat?: number;
	exp?: number;
}

interface ChatSocketData {
	user: {id: number}
}

export type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, ChatSocketData>

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway {
	@WebSocketServer()
	server: Server<ClientToServerEvents, ServerToClientEvents>

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
		payload: WsMessageNew,
	): Promise<void> {
		try {
			const msg = await this.messageService.storeMessage(
				payload.text,
				client.data.user.id,
				payload.chat_id,
			);

			const formattedMessage = mapMessageToClient(msg);

			this.server.emit(EVENTS.MESSAGE_NEW, {
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
		payload: WsMessageUpdate,
	): Promise<void> {
		const updatedMsg = await this.messageService.updateMessage(
			payload.text,
			payload.message_id,
			client.data.user.id,
		);

		const {id: message_id, text: new_text, ...formattedMessage} = mapUpdatedMessageToClient(updatedMsg);

		this.logger.log({
			event: EVENTS.MESSAGE_UPDATE,
			userId: client.data.user.id,
			messageId: payload.message_id,
			newText: payload.text,
		});

		this.server.emit(EVENTS.MESSAGE_UPDATE, {
			...formattedMessage,
			new_text,
			message_id,
		});
	}

	@UseGuards(WsJwtGuard)
	@SubscribeMessage(EVENTS.MESSAGE_DELETE)
	async handleDelMsg(
		socket: ChatSocket,
		payload: WsMessageBase
	) {
		await this.messageService.destroyMessage(payload.message_id, socket.data.user.id);

		this.server.emit(EVENTS.MESSAGE_DELETE, {message_id: payload.message_id});
	}
}
