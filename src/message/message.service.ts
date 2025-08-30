import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
	private readonly logger = new Logger(MessageService.name);

	constructor(private prisma: PrismaService) {}

	protected async findMessage(messageId: number, authorId: number): Promise<Message | null> {
		const message = await this.prisma.message.findFirst({
			where: {
				id: messageId,
				author_id: authorId
			}
		});
		
		return message;
	}

	async getMessage(messageId: number, userId: number) {
		try {
			const message = await this.findMessage(messageId, userId);

			if(!message) throw new NotFoundException(`Message with id: ${messageId} not found or you not athor`);

			return message;
		} catch (err) {
			this.logger.error(`Ошибка получения сообщения с id: ${messageId}`);
			throw(err);
		}
	}

	async getMessages() {
		try {
			const messages = await this.prisma.message.findMany();

			if (messages.length === 0) return [];

			return messages;
		} catch(err) {
			this.logger.error('Ошибка при получении сообщений');
			throw(err);
		}
		
	}

	async storeMessage(text: string, userId: number, chatId: number) {
		try {
			if (!text || !userId || !chatId) throw new Error('Invalid input data for saving message');
			const message = await this.prisma.message.create({
				data: {
					text: text,
					author: {
						connect: {
							id: userId,
						} 
					},
					chat: {
						connect: {
							id: chatId
						}
					}
				}
			});

			this.logger.log(`Message saved in DB id: ${message.id}`);

			return message;
		} catch(err) {
			if (err instanceof Error) {
				this.logger.error(err.message);
			} else {
				this.logger.error('Error saving message');
			}
			throw(err);
		}
	}

	async updateMessage(text: string, messageId: number, userId: number, chatId: number) {
		try {
			const message = await this.findMessage(messageId, userId);
			if(!message) throw new NotFoundException(`Message with id: ${messageId} not found or you not athor`);

			const updatedMessage = await this.prisma.message.update({
				where: {
					id: messageId,
					author_id: userId,
					chat_id: chatId
				},
				data: {
					text
				}
			});

			this.logger.log(`Message with id: ${messageId} updated`);

			return updatedMessage;
		} catch (err) {
			this.logger.error(`Errro during update message with id: ${messageId}`);
			throw err;
		}
	}

	async destroyMessage(messageId: number, userId: number) {
		try {
			const result = await this.prisma.message.delete({
				where: {
					id: messageId,
					author_id: userId
				}
			});
			if(!result) throw new NotFoundException('Сообщение не найдено или вы не автор');

			this.logger.log(`Сообщение успешно удалено id: ${messageId}`);
			return {
				message: 'Сообщение успешно удалено',
				message_id: messageId
			}
		} catch (err) {
			this.logger.error(`Ошибка при удалении сообщения id: ${messageId}`);
			throw err;
		}
	}
}
