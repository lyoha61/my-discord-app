export interface User {
	id: string;
	username: string;
	name?: string;
	email: string;
}

export interface AccessTokenResponse {
	access_token: string;
	expires_in: number; 
}

export interface TokensResponse extends AccessTokenResponse {
	refresh_token: string;
}

export interface RefreshAccessTokenResponse extends AccessTokenResponse {
	user_id: string;
}

export interface SocketAuth {
	access_token: string;
}
