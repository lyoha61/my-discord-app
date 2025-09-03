import type { UserResponse, UsersResponse } from "shared/types/user";
import { getAccessToken } from "./authService";

export const getUser = async (userId: number): Promise<UserResponse> => {
	const res = await fetch(`users/${userId}`);

	if (!res.ok) {
		console.error(await res.json())
	}
	
	const data = await res.json();

	return data;
}

export const getUsers = async (): Promise<UsersResponse>  => {
	const token = getAccessToken();
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


export const getMe = async (): Promise<UserResponse> => {
	const token = getAccessToken();
	const res = await fetch('users/me', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})

	if (!res.ok) {
		console.error(await res.json());
	}

	const data = await res.json();

	return data;
}