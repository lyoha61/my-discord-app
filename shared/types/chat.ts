import type { UserStatus } from "shared/types/websocket/events";

export interface MemberPrivateChat {
	id: string;
	username: string;
	avatar?: {
		id: string,
		url: string,
	}
}

export interface ChatResponse {
	id: string;
	created_at: string;
	members: MemberPrivateChat[];
}

export interface PrivateChatsResponse {
	chats: ChatResponse[];
}

export interface UserStatusPayload {
	userId: string;
	status: UserStatus;
}
