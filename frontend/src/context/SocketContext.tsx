import { createContext, useContext} from "react";
import { Socket } from 'socket.io-client';
import type { WsMessageBase, WsMessageNew, WsMessageUpdate } from "shared/types/websocket/message";
import type { ClientToServerEvents, ServerToClientEvents } from "shared/types/websocket/events";

export type SocketContextValue = {
	chatSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
	onlineUsers: string[];
	sendMessage: (payload: WsMessageNew) => Promise<WsMessageBase>;
	updateMessage: (payload: WsMessageUpdate) => void;
	deleteMessage: (payload: WsMessageBase) => void;
	readMessage: (payload: WsMessageBase) => void;
}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocketContext = () => {
	const ctx = useContext(SocketContext);
	if (!ctx) throw new Error('useSocketContext must be used inside a SocketProvider');
	return ctx
}