import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(private readonly prisma: PrismaService) {}

	async getMe(userId: number): Promise<UserDto> {
		try {
			const user = await this.prisma.user.findUniqueOrThrow({
				where: {id: userId}
			});

			return plainToInstance(UserDto, user);
		} catch (err) {
			err.message = `User with id ${userId} not found`;
			throw err;
		}
	}

	async getUser(userId: number): Promise<UserDto> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) throw new Error(`User not found: ${userId}`);

			this.logger.log(`User fetched successfully (id=${userId})`)

			return plainToInstance(UserDto, user)
		} catch (err) {
			throw err;
		}	
	}

	async getUsers(): Promise<UserDto[]> {
		const users = await this.prisma.user.findMany();
		return plainToInstance(UserDto, users);
	}
}
