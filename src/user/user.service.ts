import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(private readonly prisma: PrismaService) {}

	async getUser(userId: number) {
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
}
