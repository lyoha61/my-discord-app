import { Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './events';

export interface JwtPayload {
	sub: number;
	iat?: number;
	exp?: number;
}

interface SocketAuth {
	access_token: string;
}

interface ChatSocketData {
	user: {id: number}
}

export type ChatSocket = Socket<
	ClientToServerEvents, 
	ServerToClientEvents, 
	any, 
	ChatSocketData
> & {
	handshake: Socket['handshake'] & { auth:  SocketAuth}
}
