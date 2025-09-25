import { Injectable, Logger } from '@nestjs/common';
import { Chat, ChatMember, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);

	constructor(private readonly prisma: PrismaService) {}

	private async existingUsers(userIds: string[]): Promise<void> {
		const existingUsers = await this.prisma.user.findMany({
			where: { id: { in: userIds } },
		});

		const existingUsersIds = existingUsers.map((user) => user.id);

		const missingIds = userIds.filter((id) => !existingUsersIds.includes(id));

		if (missingIds.length > 0) {
			throw new Error(`Users not found ids: ${missingIds.join(',')}`);
		}
	}

	async getChat(chatId: string) {
		const chat = await this.prisma.chat.findUnique({
			where: { id: chatId },
			include: { members: true, messages: true },
		});

		if (!chat) throw new Error(`Chat not found: ${chatId}`);

		return chat;
	}

	async getOrCreatePrivateChat(
		currentUserId: string,
		companionUserId: string,
	): Promise<Chat & { members: (ChatMember & { user: User })[] }> {
		let chat = await this.prisma.chat.findFirst({
			where: {
				members: {
					every: { user_id: { in: [currentUserId, companionUserId] } },
				},
			},
			include: {
				members: {
					include: {user: true,}
				},
			},
		});

		if (!chat) {
			chat = await this.createChat([currentUserId, companionUserId]);
		}

		return chat;
	}

	async getPrivateChats(userId: string): Promise<(Chat & { members: (ChatMember & { user: User })[] })[]> {
		const chats = await this.prisma.chat.findMany({
			where: {
				members: {
					some: { user_id: userId },
				},
			},
			include: {
				members: { include: { user: true } },
			},
		});

		return chats;
	}

	async getPrivateChatMembers(chatId: string): Promise<User[] | null> {
		const chatMembers = await this.prisma.chatMember.findMany({
			where: { chat_id: chatId },
			include: {
				user: true,
			},
		});
		const members = chatMembers.map((chatMember) => chatMember.user);
		return members ? members : null;
	}

	async createChat(userIds: string[]) {
		const chat = await this.prisma.$transaction(async (tx) => {
			const chat = await tx.chat.create({
				data: {},
			});

			await this.existingUsers(userIds);

			await tx.chatMember.createMany({
				data: userIds.map((userId) => ({
					chat_id: chat.id,
					user_id: userId,
				})),
			});

			return tx.chat.findUnique({
				where: { id: chat.id },
				include: {
					members: {
						include: {
							user: true,
						},
					},
				},
			});
		});

		if (!chat) throw new Error('Failed to create chat');

		this.logger.log(`New chat created id: ${chat.id}`);

		return chat;
	}

	async addMembers(chatId: string, userIds: string[]) {
		const chat = await this.prisma.chat.findUnique({
			where: {
				id: chatId,
			},
		});

		if (!chat) throw new Error(`Chat not found with id: ${chatId}`);

		await this.existingUsers(userIds);

		await this.prisma.chatMember.createMany({
			data: userIds.map((user_id) => ({ chat_id: chatId, user_id })),
			skipDuplicates: true,
		});

		this.logger.log(`Members added in chat ${chatId}`);

		return { success: true, addedUsers: userIds };
	}

	uploadFile(chatId: string) {
		return chatId;
	}
}
