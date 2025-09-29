import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Logger,
	Get,
	Param,
	Delete,
	Query,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
} from '@nestjs/common';
import CreateMessageDto from './dto/create-message.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessagesResponseRest, MessageWithAuthor } from './types/message';
import type { Express } from 'express';
import { S3Service } from 'src/s3/s3.service';
import { Buckets } from 'src/common/constants/buckets';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFile } from 'src/chat/types/uploadFile';
import { FileInfo } from 'shared/types/file';

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
	private readonly logger = new Logger(MessageController.name);

	constructor(
		private readonly messagesService: MessageService,
		private readonly s3Service: S3Service,
	) {}

	private isValidFile(file: unknown): file is Express.Multer.File {
		if (!file || typeof file !== 'object') return false;

		return (
			'originalname' in file &&
			typeof file.originalname === 'string' &&
			'buffer' in file &&
			file.buffer instanceof Buffer &&
			'mimetype' in file &&
			typeof file.mimetype === 'string' &&
			'size' in file &&
			typeof file.size === 'number'
		);
	}

	@Get('/:messageId')
	async getMessage(
		@User('id') userId: string,
		@Param('messageId') messageId: string,
	) {
		this.logger.log(`Пользователь с id: ${userId} запросил ресурс`);
		const message = await this.messagesService.getMessage(messageId, userId);
		return message;
	}

	@Get()
	async getPrivateChatMessages(
		@Param('chatId') chatId: string,
		@Query() query: GetMessagesDto,
	): Promise<MessagesResponseRest> {
		const messages = await this.messagesService.getPrivateChatMessages(
			chatId,
			query,
		);

		const formattedMessages = messages.map((message) => {
			const { author, ...rest } = message;
			return {
				...rest,
				author_name: author.username,
				created_at: message.created_at.toISOString(),
				updated_at: message.updated_at.toISOString(),
			};
		});

		return { messages: formattedMessages };
	}

	@Post(':messageId/file')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@Param('messageId') messageId: string,
		@User('id') userId: string,
		@UploadedFile() file?: Express.Multer.File,
	): Promise<{ file: FileInfo | null,}> {
		let uploadedFile: { id: string, url: string } | null = null;

		if (!file) throw new BadRequestException('File is required');

		const { originalname, buffer, mimetype, size } = file;

		const key = `${messageId}-${originalname}`;
		const url = await this.s3Service.uploadFile(Buckets.APP, key, buffer);

		const fileData: UploadFile = {
				key,
				url,
				bucket: Buckets.APP,
				filename: originalname,
				size,
				mimetype,
		}

		uploadedFile = await this.messagesService.uploadFile(userId, messageId, fileData);

		return { file: uploadedFile };
	}


	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file')) 
	async sendMessage(
		@Body() body: CreateMessageDto,
		@Param('chatId') chatId: string,
		@User('id') userId: string,
	): Promise<{ message: MessageWithAuthor }> {
		const { text } = body;
		const message = await this.messagesService.storeMessage(
			text,
			userId,
			chatId,
		);
		return { message };
	}

	@Delete('/:messageId')
	async destroyMessage(
		@User('id') userId: string,
		@Param('messageId') messageId: string,
	) {
		await this.messagesService.getMessage(messageId, userId);

		await this.messagesService.destroyMessage(messageId, userId);

		return;
	}
}
