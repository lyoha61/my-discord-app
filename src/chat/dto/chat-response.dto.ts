export interface ChatMemberDto {
	id: string;
	username: string;
	name: string | null;
}

export interface ChatResponseDto {
	id: string;
	created_at: string;
	members: ChatMemberDto[];
}