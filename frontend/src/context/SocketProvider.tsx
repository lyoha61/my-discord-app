import { useEffect, useRef, useState } from "react";
import {Socket, io} from 'socket.io-client';
import { getAccessToken, refreshAccessToken } from "src/services/authService";
import { EVENTS, USER_STATUS } from 'shared/types/websocket/events';
import { SocketContext, type SocketContextValue } from "./SocketContext";
import type { UserStatusPayload } from "shared/types/chat";
import type { WsMessageBase, WsMessageNew, WsMessageUpdate } from "shared/types/websocket/message";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chatSocket, setChatSocket] = useState<Socket | null>(null);
	const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
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

		socket.on(EVENTS.USER_STATUS_CHANGED, ({ userId, status }: UserStatusPayload)=> {
			setOnlineUsers(prev => {
				if(status === USER_STATUS.ONLINE) {
					return [...new Set([...prev, userId])];
				} else {
					return prev.filter(id => id !== userId)
				}
			})
		})

		socket.on(EVENTS.ONLINE_USER_LIST, (ids: number[]) => {
			setOnlineUsers(ids);
		})

		return () => {
			socket.disconnect();
			socket?.off(EVENTS.USER_STATUS_CHANGED);
			socket?.off(EVENTS.MESSAGE_NEW);
			socket?.off(EVENTS.MESSAGE_UPDATE);
			socket?.off(EVENTS.MESSAGE_DELETE);
		}
	}, []);


	const sendMessage = (payload: WsMessageNew) => {
		if (!chatSocket) return;

		pendingMessageRef.current = payload;
		chatSocket.emit(EVENTS.MESSAGE_NEW, payload);
	}

	const updateMessage = (payload: WsMessageUpdate) => chatSocket?.emit(EVENTS.MESSAGE_UPDATE, payload)

	const deleteMessage = (payload: WsMessageBase) => chatSocket?.emit(EVENTS.MESSAGE_DELETE, payload);

	const value: SocketContextValue = {
		chatSocket,
		onlineUsers,
		sendMessage,
		updateMessage,
		deleteMessage,
	}

	return (
		<SocketContext.Provider value={value} >
			{children}
		</SocketContext.Provider>
	)
}