import type { ChatResponse, PrivateChatsResponse } from "shared/types/chat";
import type { UsersResponse } from "shared/types/user";
import { httpClient } from "src/api/http-client";

export const getAvailableChats = (): Promise<PrivateChatsResponse> => {
	return httpClient.get('chats');
}

export const getOrCreatePrivateChat = (userId: string): Promise<ChatResponse> => {
	return httpClient.post<ChatResponse>('chats/private', {user_id: userId})
}

export const getMembersPrivateChat = (
	chatId: string, 
): Promise<UsersResponse> => {
	return httpClient.get<UsersResponse>(`chats/${chatId}/members/`)
}
