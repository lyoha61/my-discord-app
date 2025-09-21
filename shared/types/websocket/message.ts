export interface WsMessageBase {
  id: number;
}

export interface WsMessageNew {
	text: string;
	chat_id: number;
}

export interface WsMessageUpdate extends WsMessageBase {
	text: string;
}


export interface WsMessageUpdateEvent extends WsMessageBase{
	updated_at: string;
	created_at: string;
}

export interface WsMessageRead extends WsMessageBase {
	read_at: string;
}