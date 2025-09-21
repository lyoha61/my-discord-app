import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessageWithAuthor, MessageWithReadAt } from './types/message';

@Injectable()
export class MessageService {
	private readonly logger = new Logger(MessageService.name);

	constructor(private prisma: PrismaService) {}

	protected async findMessage(
		messageId: number,
		authorId: number,
	): Promise<Message | null> {
		const message = await this.prisma.message.findFirst({
			where: {
				id: messageId,
				author_id: authorId,
			},
		});

		return message;
	}

	async readMessage(messageId: number): Promise<MessageWithReadAt> {
		const message = await this.prisma.message.update({
			where: { id: messageId },
			data: { read_at: new Date() }
		})

		return message as MessageWithReadAt;
	}

	async getMessage(messageId: number, userId: number) {
		try {
			const message = await this.findMessage(messageId, userId);

			if (!message)
				throw new NotFoundException(`Message not found or access denied`);

			return message;
		} catch (err) {
			this.logger.error(`Failed get message id: ${messageId}`);
			throw err;
		}
	}

	async getPrivateChatMessages(
		chatId: number,
		query: GetMessagesDto,
	): Promise<MessageWithAuthor[]> {
		const { sort = 'asc' } = query;
		const messages = await this.prisma.message.findMany({
			where: {
				chat_id: chatId,
			},
			include: {
				author: true,
			},
			orderBy: { created_at: sort },
		});

		if (messages.length === 0) return [];

		return messages;
	}

	async storeMessage(
		text: string,
		userId: number,
		chatId: number,
	): Promise<MessageWithAuthor> {
		try {
			if (!text || !userId || !chatId)
				throw new Error('Invalid input data for saving message');

			const message = await this.prisma.message.create({
				data: {
					text: text,
					author: {
						connect: {
							id: userId,
						},
					},
					chat: {
						connect: {
							id: chatId,
						},
					},
				},
				include: {
					author: true,
				},
			});

			this.logger.log(
				JSON.stringify({
					event: 'Message saved',
					messageId: message.id,
					chatId,
					userId,
				}),
			);

			return message;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error(err.message);
			} else {
				this.logger.error('Error saving message');
			}
			throw err;
		}
	}

	async updateMessage(
		text: string,
		messageId: number,
		userId: number,
	) {
		try {
			const message = await this.findMessage(messageId, userId);
			if (!message)
				throw new NotFoundException(
					`Message with id: ${messageId} not found or you not athor`,
				);

			const updatedMessage = await this.prisma.message.update({
				where: {
					id: messageId,
					author_id: userId,
				},
				data: {
					text,
					updated_at: new Date()
				},
			});

			this.logger.log(`Message with id: ${messageId} updated`);

			return updatedMessage;
		} catch (err) {
			this.logger.error(`Error during update message with id: ${messageId}`);
			throw err;
		}
	}

	async destroyMessage(messageId: number, userId: number): Promise<void> {
		try {
			const result = await this.prisma.message.delete({
				where: {
					id: messageId,
					author_id: userId,
				},
			});
			if (!result)
				throw new NotFoundException('Message not found or access denied');

			this.logger.log(`Message deleted id: ${messageId}`);

		} catch (err) {
			this.logger.error(`Failed delete message id: ${messageId}`);
			throw err;
		}
	}
}
