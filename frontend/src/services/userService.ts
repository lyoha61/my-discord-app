import type { UpdateUserData, User, UserResponse, UsersResponse } from "shared/types/user";
import { httpClient } from "src/api/http-client";
import type { UserQuery } from "src/types/api";

export const getUser = (userId: string): Promise<UserResponse> => {
	return httpClient.get<UserResponse>(`users/${userId}`)
}

export const getUsers = (params: UserQuery = {}): Promise<UsersResponse>  => {
	return httpClient.get('users', params);
}

export const getMe = (): Promise<UserResponse> => {
	return httpClient.get('users/me')
}

export const updateMyProfile = (data: UpdateUserData) => {
	return httpClient.patch<User, UpdateUserData>('users/profile', data);
}

export const updateMyProfileFormData = (data: FormData) => {
	return httpClient.patch<User, FormData>('users/profile', data);
}
