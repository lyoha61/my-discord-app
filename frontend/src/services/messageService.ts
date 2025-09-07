import type { MessagesResponse } from "shared/types/message";

interface GetMessagesOptions {
	sort?: 'asc' | 'desc'
}

export const getMessages = async (
	chatId: number, 
	options: GetMessagesOptions = {}
): Promise<MessagesResponse> => {

	const params = new URLSearchParams();
	if (options.sort) params.append('sort', options.sort);
		else params.append('sort', 'asc');
	
	const res = await fetch(`chats/${chatId}/messages?${params.toString()}`);
	if(!res.ok) throw new Error('Failed to fetch messages');

	return await res.json();
}

export const deleteMessage = async (chatId: number, messageId: number): Promise<void> => {
	const res = await fetch(`chats/${chatId}/messages/${messageId}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		const data = await res.json();
		console.error(data)
		throw new Error(data);
	}
}