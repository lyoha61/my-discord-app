export interface ChatMemberDto {
	id: number;
	username: string;
	name: string | null;
}

export interface ChatResponseDto {
	id: number;
	created_at: string;
	members: ChatMemberDto[];
}