import type { UserResponse, UsersResponse } from "shared/types/user";
import { httpClient } from "src/api/http-client";

export const getUser = (userId: number): Promise<UserResponse> => {
	return httpClient.get<UserResponse>(`users/${userId}`)
}

export const getUsers = (): Promise<UsersResponse>  => {
	return httpClient.get('users')
}

export const getMe = (): Promise<UserResponse> => {
	return httpClient.get('users/me')
}