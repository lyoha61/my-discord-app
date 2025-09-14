export const EVENTS = {
	MESSAGE_NEW: "message:new",
	MESSAGE_UPDATE: "message:update",
	MESSAGE_DELETE: "message:delete",
	TOKEN_EXPIRED: "token_expired",
	USER_STATUS_CHANGED: "user_status:changed",
	ONLINE_USER_LIST: "online_user_list",
} as const;

export const USER_STATUS = {
	ONLINE: "online",
	OFFLINE: "offline",
	IDLE: "idle",
	DND: "do_not_disturb",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type EventKey = keyof typeof EVENTS;
export type EventValue = (typeof EVENTS)[EventKey];
