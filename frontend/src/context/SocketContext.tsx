import { createContext, useContext} from "react";
import { Socket } from 'socket.io-client';
import type { ClientMessagePayload, ClientUpdateMessagePayload } from "shared/types/message";

export type SocketContextValue = {
	chatSocket: Socket | null;
	sendMessage: (payload: ClientMessagePayload) => void;
	updateMessage: (payload: ClientUpdateMessagePayload) => void;
}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocketContext = () => {
	const ctx = useContext(SocketContext);
	if (!ctx) throw new Error('useSocketContext must be used inside a SocketProvider');
	return ctx
}