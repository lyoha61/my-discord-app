import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Logger, Get, Param, ParseIntPipe, Delete, Patch, Query } from '@nestjs/common';
import type { Request } from 'express';
import CreateMessageDto from './dto/create-message.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import UpdateMessageDto from './dto/update-message.dto';
import { MessageService } from './message.service';
import { MessagesResponse } from 'shared/types/message';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
	private readonly logger = new Logger(MessageController.name);

	constructor(private readonly messagesService: MessageService) {}

	@Get('/:messageId')
	async getMessage( 
		@Req() req: Request,
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	) {
		this.logger.log(`Пользователь с id: ${userId} запросил ресурс ${req.method} ${req.originalUrl} `);
		const message = await this.messagesService.getMessage(messageId, userId);
		return message;
	}

	@Get()
	async getPrivateChatMessages(
		@Req() req: Request, 
		@User('id') userId: number,
		@Param('chatId', ParseIntPipe) chatId: number,
		@Query() query: GetMessagesDto
	): Promise< MessagesResponse > {
		this.logger.log(`User id: ${userId} fetched ${req.method} ${req.originalUrl}`)

		const messages = await this.messagesService.getPrivateChatMessages(chatId, query);

		const formattedMessages = messages.map(message => ({
			...message,
			created_at: message.created_at.toISOString(),
			updated_at: message.updated_at.toISOString(),
		}))

		return { messages: formattedMessages };	
	}


	@Post()
	@HttpCode(HttpStatus.CREATED)
	async storeMessage(
		@Body() body: CreateMessageDto, 
		@Param('chatId', ParseIntPipe) chatId: number,
		@User('id') userId: number
	) {
		const { text } = body;
		const message = await this.messagesService.storeMessage(text, userId, chatId);
		return message;
	}

	@Patch('/:messageId')
	async updateMessage(
		@Body() body: UpdateMessageDto,
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number,
		@Param('chatId', ParseIntPipe) chatId: number
	){
		const  { text } = body;

		const updatedMessage = await  this.messagesService.updateMessage(
			text, 
			messageId, 
			userId,
			chatId
		);

		return updatedMessage;
	}

	@Delete('/:messageId')
	async destroyMessage(
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	) {
		await this.messagesService.getMessage(messageId, userId);
		
		await this.messagesService.destroyMessage(messageId, userId);

		return;
	}
}
