import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);

	constructor(private readonly prisma: PrismaService) {}

	private async existingUsers(userIds: number[]): Promise<boolean> {
		const existingUsers = await this.prisma.user.findMany({
			where: {id: {in: userIds}}
		})

		if (!existingUsers) return false;

		return true;
	}

	async createChat(userIds: number[]) {
		try {
			const chat = await this.prisma.$transaction(async (tx) => {
				const chat = await tx.chat.create({
					data: {}
				});
				
				if(! await this.existingUsers(userIds)) throw new Error(`Users not found ${userIds.join(',')}`);

				await tx.chatMember.createMany({
					data: userIds.map(userId => ({
						chat_id: chat.id,
						user_id: userId
					}))
				})

				return tx.chat.findUnique({
					where: { id: chat.id },
					include: {
						members: {
							include: {
								user: true
							}
						}
					}
				})
			})

			if(!chat) throw new Error('Failed to create chat');

			this.logger.log(`New chat created id: ${chat.id}`);
		} catch (err) {
			throw(err);
		}
		
	}
}
