export const EVENTS = {
	MESSAGE_NEW: "message:new",
	MESSAGE_UPDATE: "message:update",
	MESSAGE_DELETE: "message:delete",
	TOKEN_EXPIRED: "token_expired",
} as const;

export type EventKey = keyof typeof EVENTS;
export type EventValue = (typeof EVENTS)[EventKey];
