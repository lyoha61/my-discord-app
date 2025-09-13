import type { ChatResponse, PrivateChatsResponse } from "shared/types/chat";
import type { UsersResponse } from "shared/types/user";

export const getAvailableChats = async (): Promise<PrivateChatsResponse> => {
	const res = await fetch('chats');

	if(!res.ok) throw new Error('Failed to fetch chats');

	return await res.json();
}


export const getOrCreatePrivateChat = async (userId: number): Promise<ChatResponse> => {
	const res = await fetch('chats/private', {
		method: "POST",
		headers: {
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

export const getMembersPrivateChat = async (
	chatId: number, 
): Promise<UsersResponse> => {
	const res = await fetch(`chats/${chatId}/members/`);

	if (!res.ok) {
		const data = await res.json()
		console.error(data);
		throw new Error(data);
	}

	const data = await res.json();

	return data;
}