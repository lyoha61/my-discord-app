export async function getAvailableChats(userId: number) {
	const token = localStorage.getItem('token');
	const res = await fetch('chats/private',{
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({user_id: userId})
	});

	if(!res.ok) throw new Error('Failed to fetch chats');

	return await res.json();
}