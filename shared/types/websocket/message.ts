export interface WsMessageBase {
  id: string;
}

export interface WsMessageNew {
	text: string;
	chat_id: string;
}

export interface WsMessageUpdate extends WsMessageBase {
	text?: string;
	file_id?: string;
}


export interface WsMessageUpdateEvent extends WsMessageBase{
	updated_at: string;
	created_at: string;
}

export interface WsMessageRead extends WsMessageBase {
	read_at: string;
}