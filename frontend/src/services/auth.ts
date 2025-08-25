export const register = async(username: string, email: string, password: string) => {
	const res = await fetch('/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
	});
	return res.json();
}