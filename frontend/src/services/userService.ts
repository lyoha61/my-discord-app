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
	const res = await fetch('users');
	if (!res.ok) {
		console.error(await res.json());
	}
	const data = await res.json();

	return data;
}


export const getMe = async (): Promise<UserResponse> => {
	const res = await fetch('users/me')

	if (!res.ok) {
		console.error(await res.json());
	}

	const data = await res.json();

	return data;
}