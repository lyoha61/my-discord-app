import type { MessagesResponse } from "shared/types/message";
import { httpClient } from "src/api/http-client";
import type { GetMessagesOptions } from "src/types/api";
import type { FileInfo } from "shared/types/file";

export const getMessages = (
	chatId: number, 
	options?: GetMessagesOptions
): Promise<MessagesResponse> => {

	return httpClient.get<MessagesResponse>(`chats/${chatId}/messages`, options)
}

export const updateMessage = (
	chatId: number, 
	messageId: number, 
	text: string
): Promise<void> => {

	return httpClient.patch(`chats/${chatId}/messages/${messageId}`, {text});
}

export const deleteMessage = (chatId: number, messageId: number): Promise<void> => {
	return httpClient.del(`chats/${chatId}/messages/${messageId}`)
}

export const uploadFile = async (chatId: string, messageId: string, file: File): Promise<FileInfo> => {
	const formData = new FormData();
	formData.append("file", file);
	return httpClient.post<FileInfo>(`chats/${chatId}/messages/${messageId}/file`, formData)
}