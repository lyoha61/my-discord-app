export interface Message {
	id: number;
	text: string;
	created_at: string;
	updated_at: string;
	author_id: number;
}

export interface MessageResponse {
	messages: Message[];
}