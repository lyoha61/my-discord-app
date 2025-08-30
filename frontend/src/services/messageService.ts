import type { MessageResponse } from "shared/types/message";

export const getMessages = async (chatId: number): Promise<MessageResponse> => {
	const token = localStorage.getItem('token');
	const res = await fetch(`chats/${chatId}/messages`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	if(!res.ok) throw new Error('Failed to fetch messages');
	return await res.json();
}