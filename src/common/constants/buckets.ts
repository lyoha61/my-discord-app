export const Buckets = {
	APP: 'my-discord-app',
	LOGS: 'logs'
} as const;

export type BucketTypes = typeof Buckets[keyof typeof Buckets]