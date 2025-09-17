export interface GetMessagesOptions {
	sort?: 'asc' | 'desc'
	[key: string]: string | number | boolean | undefined;
}

export type QueryParams = Record<string, string | number | boolean | undefined>