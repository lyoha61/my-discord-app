import { Message, User } from '@prisma/client';

export type MessageWithAuthor = Message & { author: User };

export type MessageWithReadAt = Omit<Message, 'read_at'> & { read_at: Date }

export interface ClientMessageRest
	extends Omit<Message, 'created_at' | 'updated_at'> 
	{
	author_name: string;
	created_at: string;
	updated_at: string;
}

export interface MessagesResponseRest {
	messages: ClientMessageRest[];
}

export interface UpdateMessageInput {
	text?: string,
	messageId: string,
	userId: string,
	fileId?: string,
}