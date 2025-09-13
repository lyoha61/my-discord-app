export interface User {
	id: number;
	email: string;
	name: string | null;
	username: string;
	created_at: string;
	updated_at: string;
}

export interface UserResponse {
	user: User;
}

export interface UsersResponse {
	users: User[];
}
