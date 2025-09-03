import { useEffect, useRef } from "react";
import {Socket, io} from 'socket.io-client';
import { getAccessToken } from "src/services/authService";

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const token = getAccessToken();
		socketRef.current = io('http://localhost:3000', {
			auth: {access_token: token}
		});

		return () => {
			socketRef.current?.disconnect();
		}
	}, []);

	return socketRef.current;
}