import { useEffect, useRef } from "react";
import {Socket, io} from 'socket.io-client';
import { getAccessToken, refreshAccessToken } from "src/services/authService";
import { EVENTS } from 'shared/events';
import type { ClientMessagePayload } from "shared/types/message";

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);
	const pendingMessageRef = useRef<unknown>(null);

	const sendMessage = (payload: unknown) => {
		if (!socketRef.current) return;

		pendingMessageRef.current = payload;
		socketRef.current.emit(EVENTS.MESSAGE_NEW, payload);
	}

	const updateMessage = (payload: ClientMessagePayload) => {
		if (!socketRef.current) return;

		socketRef.current.emit(EVENTS.MESSAGE_UPDATE, payload)
	}
	
	useEffect(() => {
		socketRef.current = io('http://localhost:3000', {
			auth: (cb) => cb({ access_token: getAccessToken() })
		});
		
		socketRef.current.on(EVENTS.TOKEN_EXPIRED, async () => {

			await refreshAccessToken();
			socketRef.current?.disconnect();
			socketRef.current?.connect();

			if (pendingMessageRef.current) {
				socketRef.current?.emit(EVENTS.MESSAGE_NEW, pendingMessageRef.current);
				pendingMessageRef.current = null;
			}
		})

		return () => {
			socketRef.current?.disconnect();
		}
	}, []);

	return {socket: socketRef.current, sendMessage, updateMessage};
}