export interface Message {
	id: string;
	text: string;
	updated_at: Date;
	created_at: Date;
	author_id: string;
	chat_id: string;
}

export interface ClientFile {
	id: string;
	url: string;
}

export type ClientMessageBase = Omit<Message, "created_at" | "updated_at" | "read_at"> & {
	created_at: string;
	updated_at: string;
	read_at: string | null;
	file?: ClientFile[];
};

export type ClientMessageRead = Omit<Message, "read_at"> & {
	read_at: string;
};

export interface ClientMessage extends ClientMessageBase {
	author_name: string;
	file?: ClientFile[];
}

export interface MessageNewEvent extends ClientMessage {
	client_id: string;
}

export interface MessageDelEvent {
	messageId: string;
}

export interface MessageUpdateEvent extends Omit<ClientMessage, "author_name"> {
	client_id: string;
}

export interface MessagesResponse {
	messages: ClientMessage[];
}

