export interface Message {
	id: number;
	text: string;
	updated_at: string;
	created_at: string;
	author_id: number;
	chat_id: number;
}

export type ClientMessageBase = Omit<Message, "created_at" | "updated_at"> & {
	created_at: string;
	updated_at: string;
};

export interface ClientMessage extends ClientMessageBase {
	author_name: string;
}

export interface MessageNewEvent extends ClientMessage {
	client_id: string;
}

export interface MessageDelEvent {
	messageId: number;
}

export interface MessageUpdateEvent extends Omit<ClientMessage, "author_name"> {
	client_id: string;
}

export interface MessagesResponse {
	messages: ClientMessage[];
}

