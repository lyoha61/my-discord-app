import { Message } from "@prisma/client";

export type ClientMessage = Omit<Message, 'created_at' | 'updated_at'> & {
	created_at: string;
	updated_at: string;
	author_name: string;
}

export interface MessageEvent extends ClientMessage {
	client_id: string;
}

export interface MessagesResponse {
	messages: ClientMessage[];
}

export interface ClientMessagePayload {
	text: string;
	chat_id: number;
}
