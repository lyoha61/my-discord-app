import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMemberChatDto } from './dto/add-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';
import { ChatResponse, PrivateChatsResponse } from 'shared/types/chat';
import { UsersResponse } from 'shared/types/user';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get(':chatId')
	async getChat(
		@Param('chatId') chatId: string,
	) {
		const chat = await this.chatService.getChat(chatId);
		return chat;
	}

	@Post('private')
	async getOrCreatePrivateChat(
		@User('id') currentUserId: string,
		@Body() body: CreatePrivateChatDto,
	): Promise<ChatResponseDto> {
		const { user_id: companionUserId } = body;

		const chat = await this.chatService.getOrCreatePrivateChat(
			currentUserId,
			companionUserId,
		);

		return {
			id: chat.id,
			created_at: chat.created_at.toISOString(),
			members: chat.members.map((member) => {
				return {
					id: member.user_id,
					username: member.user.username,
					name: member.user.name,
				}
			})
		};
	}

	@Get()
	async getPrivateChats(
		@User('id') userId: string,
	): Promise<PrivateChatsResponse> {
		const chats = await this.chatService.getPrivateChats(userId);

		const formattedChats: ChatResponse[] = chats.map((chat) => ({
			id: chat.id,
			created_at: chat.created_at.toISOString(),
			members: chat.members
				.filter((m) => m.user_id !== userId)
				.map((m) => ({
					id: m.user_id,
					username: m.user.username,
				})),
		}));

		return { chats: formattedChats };
	}

	@Get(':chatId/members/')
	async getPrivateChatMembers(
		@Param('chatId') chatId: string,
	): Promise<UsersResponse> {
		const users = await this.chatService.getPrivateChatMembers(chatId);

		if (!users) {
			throw new NotFoundException(`Chat with id ${chatId} not found`);
		}

		const formattedUsers = users?.map((user) => ({
			...user,
			created_at: user.created_at.toISOString(),
			updated_at: user.updated_at.toISOString(),
		}));

		return { users: formattedUsers };
	}

	@Post()
	async createChat(@Body() body: CreateChatDto) {
		const { user_ids: userIds } = body;
		await this.chatService.createChat(userIds);
	}

	@Post(':chatId/members')
	async addMembers(
		@Body() body: AddMemberChatDto,
		@Param('chatId') chatId: string,
	) {
		const { user_ids: userIds } = body;
		const result = this.chatService.addMembers(chatId, userIds);
		return result;
	}
}
