import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMemberChatDto } from './dto/add-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User from 'src/common/decorators/user.decorator';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {

	constructor(private readonly chatService: ChatService) {}

	@Get(':chatId')
	async getChat(
		@Param('chatId', ParseIntPipe) chatId: number
	) {
		const chat = await this.chatService.getChat(chatId);
		return chat;
	}

	@Post('private')
	async getOrCreatePrivateChat(
		@User('id') currentUserId: number,
		@Body() body: CreatePrivateChatDto
	) {
		const { user_id: companionUserId } = body;
		const chat = await this.chatService.getOrCreatePrivateChat(currentUserId, companionUserId); 
		return chat;
	}

	@Post()
	async createChat(
		@Body() body: CreateChatDto
	) {
		const { user_ids: userIds } = body;
		await this.chatService.createChat(userIds)
	}

	@Post(':chatId/members')
	async addMembers(
		@Body() body: AddMemberChatDto,
		@Param('chatId', ParseIntPipe) chatId: number
	) {
		const { user_ids: userIds } = body;
		const result = this.chatService.addMembers(chatId, userIds);
		return result;
	}
}
