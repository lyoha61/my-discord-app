import { Request, Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Logger } from '@nestjs/common';
import CreateMessageDto from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import User from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
	private readonly logger = new Logger(MessageController.name);

	constructor(private readonly prisma: PrismaService) {}

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
			console.error(err);
		}
	
	}
}
