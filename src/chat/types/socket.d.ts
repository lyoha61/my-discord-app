import { DefaultEventsMap, Socket } from "socket.io";

export interface ClientData {
	user: { id: number; username: string };
}

export type ChatSocket = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	ClientData
>;
