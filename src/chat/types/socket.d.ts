import { DefaultEventsMap, Socket } from "socket.io";

export interface ClientData {
	user: { id: number };
}

export type ChatSocket = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	ClientData
>;
