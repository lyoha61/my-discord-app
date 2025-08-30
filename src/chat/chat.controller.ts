import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMemberChatDto } from './dto/add-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User from 'src/common/decorators/user.decorator';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';
import { ChatResponse, PrivateChatsResponse } from 'shared/types/chat';

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

	@Get()
	async getPrivateChats(
		@User('id') userId: number 
	): Promise< PrivateChatsResponse > {
		const chats = await this.chatService.getPrivateChats(userId);

		const formattedChats: ChatResponse[] = chats.map(chat => ({
			id: chat.id,
			created_at: chat.created_at.toISOString(),
			members: chat.members
				.filter(m => m.id !== userId)
				.map(m => ({
					id: m.id,
					username: m.user.username
				}))
		}))

		return { chats: formattedChats }
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
