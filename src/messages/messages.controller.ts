import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import CreateMessageDto from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('messages')
export class MessagesController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async storeMessage(@Body() body: CreateMessageDto) {
		try {
			const message = await this.prisma.message.create({
				data: {
					text: body.text,
					author: {
						connectOrCreate: {
							where: {email: "example@email.com"},
							create: {
								username: "Test name",
								email: "example@email.com",
								password: '123'
							}
						} 
					}
				}
			});
			return message;
		} catch(err) {
			console.error(err);
		}
	
	}
}
