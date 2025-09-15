import type { TokensResponse } from "shared/types/auth";
import { jwtDecode } from "jwt-decode";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshTimeout: number | null = null;


const isTokenResponse = (data: any): data is TokensResponse => {
	return typeof data?.access_token === 'string' &&
				 typeof data?. expires_in === 'number';
}

export const saveTokens = (data: TokensResponse): void => {
	console.log('Enter savetokens')
	console.log(data)
	accessToken = data.access_token;
	localStorage.setItem('access_token', accessToken);

	if(data.refresh_token) {
		console.log('Enter in if')
		refreshToken = data.refresh_token;
		localStorage.setItem('refresh_token', refreshToken);
	};

	if(refreshTimeout) clearTimeout(refreshTimeout);
	refreshTimeout = window.setTimeout(
		refreshAccessToken,
		(data.expires_in - 30) * 1000
	);
}

export const getAccessToken = (): string | null => {
	if (!accessToken) accessToken = localStorage.getItem("access_token");
	return accessToken;
}

export const getCurrentUserId = (): number | null  => {
	const token = getAccessToken();
	if (!token) return null;

	try {
		const decoded = jwtDecode<{sub: number}>(token);
		return decoded.sub;
	} catch (err) {
		console.error("Failed to decode token", err);
		return null;
	}
}

export const register = async(
	email: string,
	password: string
): Promise<void> => {
	const res = await fetch('/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	const data = await res.json()

	if (!res.ok) {
		console.error(data);
		throw new Error(data)
	}

	if (!isTokenResponse(data)) {
		throw new Error('Invalid response format from server');
	}

	saveTokens(data);
}

export const login = async(
	email: string,
	password: string,
): Promise<void> => {
	const res = await fetch('/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	const data = await res.json();

	if (!res.ok) {
		console.error(data);
		throw new Error(data)
	}
	
	if (!isTokenResponse(data)) {
		throw new Error('Invalid response format from server');
	}

	saveTokens(data);
}

export const logout = async () => {
	const res = await fetch('auth/logout', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});

	if (!res.ok) {
		console.log(await res.json());
	}

	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');

	window.location.href = '/login';
}

export const refreshAccessToken = async (): Promise<void> => {
	if (!refreshToken) {
		refreshToken = localStorage.getItem("refresh_token")
	};

	if (!refreshToken) {
		throw new Error("No refresh token available");
	}

	const res = await fetch('auth/refresh', {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ refresh_token : refreshToken })
	});

	if(res.status === 401 || res.status === 403) {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		accessToken = null;
		refreshToken = null;
		throw new Error('Refresh token expired, please login again');
	}

	if (!res.ok) {
		console.error(await res.json());
		return;
	}

	const data: TokensResponse = await res.json();
	saveTokens(data);
};