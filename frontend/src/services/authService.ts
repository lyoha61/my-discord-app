import type { TokensResponse } from "shared/types/auth";
import { jwtDecode } from "jwt-decode";
import { httpClient, type HttpError } from "src/api/http-client";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshTimeout: number | null = null;


const isTokenResponse = (data: unknown): data is TokensResponse => {
	return (
		typeof data === 'object' &&
		data !== null &&
		'access_token' in data &&
		'expires_in' in data &&
		typeof data?.access_token === 'string' &&
		typeof data?. expires_in === 'number'
	);
}

export const saveTokens = (data: TokensResponse): void => {
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

export const getCurrentUserId = (): string | null  => {
	const token = getAccessToken();
	if (!token) return null;

	try {
		const decoded = jwtDecode<{sub: string}>(token);
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
	const data = await httpClient.post<TokensResponse>('auth/register', {email, password});

	if (!isTokenResponse(data)) {
		throw new Error('Invalid response format from server');
	}

	saveTokens(data);
}

export const login = async(
	email: string,
	password: string,
): Promise<void> => {
	
	const data = await httpClient.post('auth/login', {email, password})
	
	if (!isTokenResponse(data)) {
		throw new Error('Invalid response format from server');
	}

	saveTokens(data);
}

export const logout = async () => {
	await httpClient.post('auth/logout');

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
	try {
		const data = await httpClient.post<TokensResponse>('auth/refresh', {refresh_token : refreshToken});
			saveTokens(data); 
	} catch (err) {
		if((err as HttpError).status === 401 || 
			(err as HttpError).status === 403
		) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			accessToken = null;
			refreshToken = null;
			throw new Error('Refresh token expired, please login again');
	}
	}
};