export interface Message {
	id: number;
	text: string;
	createdAt: string;
	updatedAt: string;
	authorId: string;
}

export interface MessagesRes {
	messages: Message[];
}