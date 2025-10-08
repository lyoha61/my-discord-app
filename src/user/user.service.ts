import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { UpdateUserData } from './types/user.types';
import { UploadFile } from 'src/chat/types/uploadFile';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(private readonly prisma: PrismaService) {}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		return user;
	}

	// async getMe(userId: string): Promise<UserDto> {
	// 	try {
	// 		const user = await this.prisma.user.findUniqueOrThrow({
	// 			where: { id: userId },
	// 		});

	// 		return plainToInstance(UserDto, user);
	// 	} catch (err) {
	// 		if (err instanceof Error) {
	// 			err.message = `User with id ${userId} not found`;
	// 		}
	// 		throw err;
	// 	}
	// }

	async getUser(userId: string): Promise<UserDto> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {avatar: { select: {id:true, url:true} }}
		});

		if (!user) throw new Error(`User not found: ${userId}`);

		this.logger.log(`User fetched successfully (id=${userId})`);

		return plainToInstance(UserDto, user);
	}

	async getUsers(search?: string): Promise<UserDto[]> {
		const users = await this.prisma.user.findMany({
			where:  search ? {
				username: { contains: search, mode: 'insensitive' }
			} : {}
		});
		
		return plainToInstance(UserDto, users);
	}

	async updateUser(userId: string, data: UpdateUserData) {
		const user = await this.prisma.user.update({
			where: {id: userId},
			data
		});
		return user;
	}

	async loadAvatar(userId: string, avatar: UploadFile){
		const uploadedFile = await this.prisma.file.create({
			data: {
				userId: userId,
				type: 'avatar',
				...avatar
			}
		});

		await this.prisma.user.update({
			where: {id: userId},
			data: {avatar_id: uploadedFile.id}
		});

		return {
			id: uploadedFile.id,
			url: uploadedFile.url,
		}
	}
}
