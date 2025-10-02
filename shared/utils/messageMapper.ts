import { Message } from "@prisma/client";
import { ClientMessage, ClientMessageBase, ClientMessageRead } from "shared/types/message";
import { MessageWithAuthor, MessageWithReadAt } from "src/message/types/message";

export const mapMessageToClientWithAuthor = (
	msg: MessageWithAuthor,
): ClientMessage => {
	const { author, ...rest } = msg;
	return {
		...rest,
		author_name: author.username,
		created_at: msg.created_at.toISOString(),
		updated_at: msg.updated_at.toISOString(),
		read_at: msg.read_at ? msg.read_at.toISOString() : null,
	};
};

export const mapMessageToClient = (msg: Message): ClientMessageBase => {
	return {
		...msg,
		created_at: msg.created_at.toISOString(),
		updated_at: msg.updated_at.toISOString(),
		read_at: msg.read_at ? msg.read_at.toISOString() : null,
	};
};

export const mapMessageReadToClient = (msg: MessageWithReadAt): ClientMessageRead => {
	return {
		...msg,
		read_at: msg.read_at.toISOString(),
	};
};
