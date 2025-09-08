export const EVENTS = {
	MESSAGE: "message",
	TOKEN_EXPIRED: "token_expired"
} as const;

export type EventKey =  keyof typeof EVENTS;
export type EventValue = typeof EVENTS[EventKey];