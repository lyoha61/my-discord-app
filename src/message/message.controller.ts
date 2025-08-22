import { Request, Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import CreateMessageDto from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('messages')
export class MessagesController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async storeMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
		try {
			const userId = req.user['sub'];

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
			return message;
		} catch(err) {
			console.error(err);
		}
	
	}
}
