import { ClientMessage } from "../message";
import { 
	WsMessageBase,
	WsMessageNew,
	WsMessageRead,
	WsMessageUpdate,
	WsMessageUpdateEvent 
} from "./message";

export const EVENTS = {
	MESSAGE_NEW: "message:new",
	MESSAGE_UPDATE: "message:update",
	MESSAGE_DELETE: "message:delete",
	MESSAGE_READ: "message:read",
	MESSAGE_ACK: "message:ack",

	TOKEN_EXPIRED: "token_expired",
	USER_STATUS_CHANGED: "user_status:changed",
	ONLINE_USER_LIST: "online_user_list",
} as const;

export const USER_STATUS = {
	ONLINE: "online",
	OFFLINE: "offline",
	IDLE: "idle",
	DND: "do_not_disturb",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type EventKey = keyof typeof EVENTS;
export type EventValue = (typeof EVENTS)[EventKey];


export interface ClientToServerEvents {

	[EVENTS.MESSAGE_NEW]: (
		data: WsMessageNew, 
		callback?: (savedMessage: WsMessageBase) => void,
	) => void;
	[EVENTS.MESSAGE_UPDATE]: (data:WsMessageUpdate) => void;
	[EVENTS.MESSAGE_DELETE]: (data: WsMessageBase) => void;
	[EVENTS.MESSAGE_READ]: (data: WsMessageBase) => void;

	[EVENTS.USER_STATUS_CHANGED]: (data: { userId: number; status: UserStatus }) => void;
}

export interface ServerToClientEvents {
	[EVENTS.MESSAGE_NEW]: (data: ClientMessage) => void;
	[EVENTS.MESSAGE_UPDATE]: (data: WsMessageUpdateEvent) => void;
	[EVENTS.MESSAGE_DELETE]: (data: WsMessageBase) => void;
	[EVENTS.MESSAGE_READ]: (data: WsMessageRead) => void;
	[EVENTS.MESSAGE_ACK]: (data: WsMessageBase) => void;

	[EVENTS.TOKEN_EXPIRED]: () => void;

	[EVENTS.ONLINE_USER_LIST]: (data: string[]) => void;
	[EVENTS.USER_STATUS_CHANGED]:(data: {userId: string; status: UserStatus}) => void;
}