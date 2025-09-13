import { Message } from "@prisma/client";
import { ClientMessage, ClientMessageBase } from "shared/types/message";
import { MessageWithAuthor } from "src/message/types/message";

export const mapMessageToClient = (
	message: MessageWithAuthor,
): ClientMessage => {
	const { author, ...rest } = message;
	return {
		...rest,
		author_name: author.username,
		created_at: message.created_at.toISOString(),
		updated_at: message.updated_at.toISOString(),
	};
};

export const mapUpdatedMessageToClient = (msg: Message): ClientMessageBase => {
	return {
		...msg,
		created_at: msg.created_at.toISOString(),
		updated_at: msg.updated_at.toISOString(),
	};
};
