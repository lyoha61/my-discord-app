import { z } from 'zod';

export const envSchema = z.object({
	JWT_SECRET: z.string(),
	ACCESS_TOKEN_EXPIRES_IN: z.string(),
	REFRESH_TOKEN_EXPIRES_IN: z.string(),
});
