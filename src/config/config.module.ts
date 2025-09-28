import { z } from 'zod';

export const envSchema = z.object({
	JWT_SECRET: z.string(),
	ACCESS_TOKEN_EXPIRES_IN: z.string(),
	REFRESH_TOKEN_EXPIRES_IN: z.string(),

	MINIO_ENDPOINT: z.string(),
	MINIO_ACCESS_KEY: z.string(),
	MINIO_SECRET_KEY: z.string(),
	MINIO_REGION: z.string(),
});
