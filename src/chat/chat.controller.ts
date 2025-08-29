import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatsController {

	constructor(private readonly chatService: ChatService) {}

	@Post()
	async createChat(@Body() createChatDto: CreateChatDto) {
		const { userIds } = createChatDto;
		this.chatService.createChat(userIds)
	}

}
