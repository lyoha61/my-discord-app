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
	return res.json();
}