export interface UserResponse {
	id: number;
	email: string;
	name?: string;
	username: string;
	created_at: Date;
	updated_at: Date;
}

export interface UsersResponse {
	users: UserResponse[];
}