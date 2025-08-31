import type { UserResponse, UsersResponse } from "shared/types/user";

export const getUser = async (userId: number): Promise<UserResponse> => {
	const res = await fetch(`users/${userId}`);

	if (!res.ok) {
		console.error(await res.json())
	}
	
	const data = await res.json();

	return data;
}

export const getUsers = async (): Promise<UsersResponse>  => {
	const token = localStorage.getItem('token');
	const res = await fetch('users', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	if (!res.ok) {
		console.error(await res.json());
	}
	const data = await res.json();

	return data;
}