export interface User {
	id: number;
	username: string;
	name?: string;
	email: string;  
}

export interface Tokens {
	access_token: string;
	refresh_token: string;
}

export interface RegisterRes {
	tokens: Tokens;
	user: User;
}
