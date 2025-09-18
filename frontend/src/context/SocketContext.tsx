import { createContext, useContext} from "react";
import { Socket } from 'socket.io-client';
import type { WsMessageBase, WsMessageNew, WsMessageUpdate } from "shared/types/websocket/message";

export type SocketContextValue = {
	chatSocket: Socket | null;
	onlineUsers: number[];
	sendMessage: (payload: WsMessageNew) => void;
	updateMessage: (payload: WsMessageUpdate) => void;
	deleteMessage: (payload: WsMessageBase) => void;
}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocketContext = () => {
	const ctx = useContext(SocketContext);
	if (!ctx) throw new Error('useSocketContext must be used inside a SocketProvider');
	return ctx
}