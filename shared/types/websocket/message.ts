export interface WsMessageBase {
  message_id: number;
}

export interface WsMessageNew {
	text: string;
	chat_id: number;
}

export interface WsMessageUpdate extends WsMessageBase {
	text: string;
}


export interface WsMessageUpdateEvent extends WsMessageBase{
	new_text: string;
	updated_at: string;
	created_at: string;
}