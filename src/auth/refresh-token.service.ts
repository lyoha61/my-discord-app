import { Injectable } from '@nestjs/common';
import { redisClient } from 'src/common/decorators/redis/redis.client';

@Injectable()
export class RefreshTokenService {
	async setToken(userId: string, token: string): Promise<string> {
		return await redisClient.set(
			`refresh_token:${userId}`,
			token,
			'EX',
			7 * 24 * 60 * 60,
		);
	}

	async saveToken(userId: string, token: string): Promise<void> {
		await redisClient.set(
			`refresh_token:${userId}`,
			token,
			'EX',
			7 * 24 * 60 * 60,
		);
	}

	async getToken(userId: string): Promise<string | null> {
		return await redisClient.get(`refresh_token:${userId}`);
	}

	async deleteToken(userId: string): Promise<void> {
		await redisClient.del(`refresh_token:${userId}`);
	}

	async isTokenValid(userId: string, token: string): Promise<boolean> {
		const originToken = await this.getToken(userId);

		return originToken === token;
	}
}
