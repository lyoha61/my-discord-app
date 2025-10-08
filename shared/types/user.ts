export interface User {
	id: string;
	email: string;
	name: string | null;
	username: string;
	created_at: string;
	updated_at: string;
	avatar?: {
		id: string,
		url: string,
	}
}

export type EditableAvatar = Partial<Omit<User, 'avatar'>> & {
	avatar?: {
		id?: string; 
		url: string
	}
}

export interface UserResponse {
	user: User;
}

export interface UsersResponse {
	users: User[];
}

export interface UpdateUserData {
	username?: string,
	name?: string,
	avatar_id?: string
	email?: string
	password?: string
	
}