import { useEffect, useRef, useState } from "react";
import {Socket, io} from 'socket.io-client';
import { getAccessToken, refreshAccessToken } from "src/services/authService";
import { EVENTS } from 'shared/events';
import type { ClientMessagePayload } from "shared/types/message";
import { SocketContext, type SocketContextValue } from "./SocketContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chatSocket, setChatSocket] = useState<Socket | null>(null);
	const pendingMessageRef = useRef<unknown>(null);
	
	useEffect(() => {
		const socket = io('http://localhost:3000', {
			auth: (cb) => cb({ access_token: getAccessToken() })
		});
		setChatSocket(socket);

		socket.on(EVENTS.TOKEN_EXPIRED, async () => {

			await refreshAccessToken();
			socket.disconnect();
			socket.connect();

			if (pendingMessageRef.current) {
				socket.emit(EVENTS.MESSAGE_NEW, pendingMessageRef.current);
				pendingMessageRef.current = null;
			}
		})

		return () => {
			socket.disconnect();
		}
	}, []);


	const sendMessage = (payload: unknown) => {
		if (!chatSocket) return;

		pendingMessageRef.current = payload;
		chatSocket.emit(EVENTS.MESSAGE_NEW, payload);
	}

	const updateMessage = (payload: ClientMessagePayload) => chatSocket?.emit(EVENTS.MESSAGE_UPDATE, payload)

	const value: SocketContextValue = {
		chatSocket,
		sendMessage,
		updateMessage,
	}

	return (
		<SocketContext.Provider value={value} >
			{children}
		</SocketContext.Provider>
	)
}