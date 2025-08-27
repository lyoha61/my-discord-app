
import type { MessagesRes } from "shared/types/message";

export const fetchMessages = async(): Promise<MessagesRes> => {
	const token = localStorage.getItem('token');
	const res = await fetch('messages', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	if(!res.ok) throw new Error('Failed to fetch messages');
	return await res.json();
}