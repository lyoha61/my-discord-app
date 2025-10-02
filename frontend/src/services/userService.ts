import type { UserResponse, UsersResponse } from "shared/types/user";
import { httpClient } from "src/api/http-client";
import type { UserQuery } from "src/types/api";

export const getUser = (userId: number): Promise<UserResponse> => {
	return httpClient.get<UserResponse>(`users/${userId}`)
}

export const getUsers = (params: UserQuery = {}): Promise<UsersResponse>  => {
	return httpClient.get('users', params);
}

export const getMe = (): Promise<UserResponse> => {
	return httpClient.get('users/me')
}