import type { MessagesResponse } from "shared/types/message";
import { getAccessToken } from "./authService";

interface GetMessagesOptions {
	sort?: 'asc' | 'desc'
}

export const getMessages = async (
	chatId: number, 
	options: GetMessagesOptions = {}
): Promise<MessagesResponse> => {
	const token = getAccessToken();

	const params = new URLSearchParams();
	if (options.sort) params.append('sort', options.sort);
		else params.append('sort', 'asc');
	
	const res = await fetch(`chats/${chatId}/messages?${params.toString()}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	if(!res.ok) throw new Error('Failed to fetch messages');

	return await res.json();
}

export const deleteMessage = async (chatId: number, messageId: number): Promise<void> => {
	const token = getAccessToken();

	if (!token) throw new Error('Missing access token');

	const res = await fetch(`chats/${chatId}/messages/${messageId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	if (!res.ok) {
		const data = await res.json();
		console.error(data)
		throw new Error(data);
	}
}