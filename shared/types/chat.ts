import type { UserStatus } from "shared/types/websocket/events";

export interface MemberPrivateChat {
	id: number;
	username: string;
}

export interface ChatResponse {
	id: number;
	created_at: string;
	members: MemberPrivateChat[];
}

export interface PrivateChatsResponse {
	chats: ChatResponse[];
}

export interface UserStatusPayload {
	userId: number;
	status: UserStatus;
}
