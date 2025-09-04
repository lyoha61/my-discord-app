import { useEffect, useRef } from "react";
import type { SocketAuth } from "shared/types/auth";
import {Socket, io} from 'socket.io-client';
import { getAccessToken } from "src/services/authService";

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const accesToken = getAccessToken();

		if (!accesToken) throw new Error('Access token is missing');

		const authData: SocketAuth = { access_token: accesToken };

		socketRef.current = io('http://localhost:3000', {
			auth: authData
		});

		return () => {
			socketRef.current?.disconnect();
		}
	}, []);

	return socketRef.current;
}