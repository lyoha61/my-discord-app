import type { RegisterRes } from "shared/types/auth";

export const register = async(
	email: string,
	password: string
): Promise<RegisterRes> => {
	const res = await fetch('/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	return await res.json();
}

export const login = async(
	email: string,
	password: string,
) => {
	const res = await fetch('/auth/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password })
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}

	return data;
}