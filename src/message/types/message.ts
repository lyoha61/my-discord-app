import { Message, User } from '@prisma/client';

export type MessageWithAuthor = Message & { author: User };

export interface ClientMessageRest
	extends Omit<Message, 'created_at' | 'updated_at'> {
	author_name: string;
	created_at: string;
	updated_at: string;
}

export interface MessagesResponseRest {
	messages: ClientMessageRest[];
}
