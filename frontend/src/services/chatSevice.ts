import type { ChatResponse, PrivateChatsResponse } from "shared/types/chat";

export const getAvailableChats = async (): Promise<PrivateChatsResponse> => {
	const token = localStorage.getItem('token');
	const res = await fetch('chats',{
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});

	if(!res.ok) throw new Error('Failed to fetch chats');

	return await res.json();
}


export const getOrCreatePrivateChat = async (userId: number): Promise<ChatResponse> => {
	const token = localStorage.getItem('token');
	const res = await fetch('chats/private', {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user_id: userId})
	});

	if (!res.ok) {
		console.error(await res.json());
	}

	const data = await res.json();

	return data
}