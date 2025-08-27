import { useEffect, useRef } from "react";
import {Socket, io} from 'socket.io-client';

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		socketRef.current = io('http://localhost:3000', {
			auth: {token: localStorage.getItem('token')}
		});

		return () => {
			socketRef.current?.disconnect();
		}
	}, []);

	return socketRef.current;
}