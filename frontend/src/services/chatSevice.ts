import type { PrivateChatsResponse } from "shared/types/chat";

export async function getAvailableChats(): Promise<PrivateChatsResponse> {
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