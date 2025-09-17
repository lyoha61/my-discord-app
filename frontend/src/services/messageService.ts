import type { MessagesResponse } from "shared/types/message";
import { httpClient } from "src/api/http-client";
import type { GetMessagesOptions } from "src/types/api";

export const getMessages = async (
	chatId: number, 
	options?: GetMessagesOptions
): Promise<MessagesResponse> => {

	return httpClient.get<MessagesResponse>(`chats/${chatId}/messages`, options)
}

export const updateMessage = async(
	chatId: number, 
	messageId: number, 
	text: string
): Promise<void> => {

	httpClient.patch(`chats/${chatId}/messages/${messageId}`, {text});
}

export const deleteMessage = async (chatId: number, messageId: number): Promise<void> => {
	httpClient.del(`chats/${chatId}/messages/${messageId}`)
}
