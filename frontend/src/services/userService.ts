import type { UserResponse } from "../types/user";

export const getUser = async (userId: number) => {
	const res = await fetch(`users/${userId}`);

	if (!res.ok) {
		console.error(await res.json())
	}
	
	const data: UserResponse = await res.json();

	return data;
}