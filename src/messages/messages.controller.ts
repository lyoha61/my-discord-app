import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Logger, Get, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import type { Request } from 'express';
import CreateMessageDto from './dto/create-message.dto';
import User from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import UpdateMessageDto from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
	private readonly logger = new Logger(MessagesController.name);

	constructor(private readonly messagesService: MessagesService) {}

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
	async getMessages(@Req() req: Request, @User('id') userId: number) {
		this.logger.log(`Пользователь с id: ${userId} запросил ресурс ${req.method} ${req.originalUrl}`)

		const messages = await this.messagesService.getMessages();

		return {messages: messages};	
	}


	@Post()
	@HttpCode(HttpStatus.CREATED)
	async storeMessage(
		@Body() body: CreateMessageDto, 
		@User('id') userId: number
	) {
		const message = await this.messagesService.storeMessage(body.text, userId);
		return message;
	}

	@Patch('/:messageId')
	async updateMessage(
		@Body() body: UpdateMessageDto,
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	){
		const updatedMessage = await  this.messagesService.updateMessage(
			body.text, 
			messageId, 
			userId
		);

		return updatedMessage;
	}

	@Delete('/:messageId')
	async destroyMessage(
		@User('id') userId: number,
		@Param('messageId', ParseIntPipe) messageId: number
	) {
		await this.messagesService.destroyMessage(messageId, userId);
		return {
			status: 'success',
			message_id: messageId
		}
	}
}
