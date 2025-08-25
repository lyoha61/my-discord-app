import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Logger, Get, Param, ParseIntPipe, Delete, NotFoundException, Patch } from '@nestjs/common';
import type { Request } from 'express';
import CreateMessageDto from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import User from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import UpdateMessageDto from './dto/update-message.dto';
import { Message } from '@prisma/client';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
	private readonly logger = new Logger(MessagesController.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMessage(messageId: number, authorId: number): Promise<Message | null> {
		const message = await this.prisma.message.findFirst({
			where: {
				id: messageId,
				author_id: authorId
			}
		});
		
		return message;
	}

	@Get('/:messageId')
	async getMessage( 
		@Req() req: Request,
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	) {
		try {
			const message = await this.findMessage(messageId, userId);

			if(!message) throw new NotFoundException(`Message with id: ${messageId} not found or you not athor`);

			this.logger.log(`Пользователь с id: ${userId} запросил ресурс ${req.method} ${req.originalUrl} `);
			return message;
		} catch (err) {
			this.logger.error(`Ошибка получения сообщения с id: ${messageId}`);
			throw(err);
		}
	}

	@Get()
	async getMessages(@Req() req: Request, @User('id') userId: number) {
		try {
			const messages = await this.prisma.message.findMany({
				where: {author_id: userId}
			});

			if (messages.length === 0) {
				return ({message: 'У пользователя отсутствуют сообщения'});
			}
			
			this.logger.log(`Пользователь с id: ${userId} запросил ресурс ${req.method} ${req.originalUrl}`)

			return messages;

		} catch (err) {
			this.logger.error('Ошибка при получении сообщений');
			throw err;
		}
	}


	@Post()
	@HttpCode(HttpStatus.CREATED)
	async storeMessage(
		@Body() body: CreateMessageDto, 
		@User('id') userId: number
	) {
		try {
			const message = await this.prisma.message.create({
				data: {
					text: body.text,
					author: {
						connect: {
							id: userId,
							
						} 
					}
				}
			});

			this.logger.log(`Новое сообщение создано id: ${message.id}`);

			return message;
		} catch(err) {
			this.logger.error('Ошибка при сохранении сообщения');
			throw err;
		}
	}

	@Patch('/:messageId')
	async updateMessage(
		@Body() body: UpdateMessageDto,
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	){
		try {
			const message = await this.findMessage(messageId, userId);
			if(!message) throw new NotFoundException(`Message with id: ${messageId} not found or you not athor`);

			const newDataMessage = body.text;
			const updatedMessage = await this.prisma.message.update({
				where: {
					id: messageId,
					author_id: userId
				},
				data: {
					text: newDataMessage
				}
			});

			this.logger.log(`Message with id: ${messageId} updated`);

			return updatedMessage;
		} catch (err) {
			this.logger.error(`Errro during update message with id: ${messageId}`);
			throw err;
		}
	}

	@Delete('/:messageId')
	async destroyMessage(
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	) {
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
			throw(err);
		}
	}
}
