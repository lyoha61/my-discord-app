import { Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './events';

export interface JwtPayload {
	sub: string;
	iat?: number;
	exp?: number;
}

interface SocketAuth {
	access_token: string;
}

interface ChatSocketData {
	user: {id: string}
}

export type ChatSocket = Socket<
	ClientToServerEvents, 
	ServerToClientEvents, 
	any, 
	ChatSocketData
> & {
	handshake: Socket['handshake'] & { auth: SocketAuth }
}
