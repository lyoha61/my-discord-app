import type { MessagesResponse } from "shared/types/message";
import { getAccessToken } from "./authService";

export const getMessages = async (chatId: number): Promise<MessagesResponse> => {
	const token = getAccessToken();
	
	const res = await fetch(`chats/${chatId}/messages`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	if(!res.ok) throw new Error('Failed to fetch messages');

	return await res.json();
}