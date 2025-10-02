export interface GetMessagesOptions {
	sort?: 'asc' | 'desc'
	[key: string]: string | number | boolean | undefined;
}

export type QueryParams = Record<string, string | number | boolean | undefined>

export interface UserQuery {
	sort?: 'asc' | 'desc',
	search?: string,
	[key: string]: string | number | boolean | undefined;
}