import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

const logger = new Logger();

export const redisClient = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
});

redisClient.on('connect', () => {
	logger.log('Connected to Redis');
});

redisClient.on('error', (err) => {
	logger.error('Redis error', err);
});
