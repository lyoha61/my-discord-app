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