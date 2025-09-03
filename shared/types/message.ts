export interface Message {
	id: number;
	text: string;
	created_at: string;
	updated_at: string;
	author_id: number;
}

export interface MessagesResponse {
	messages: Message[];
}

export interface ClientMessagePayload {
	text: string;
	chat_id: number;
}
