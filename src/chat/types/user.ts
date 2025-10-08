import { Chat, ChatMember, File, User } from '@prisma/client';

export interface UserWithAvatar extends User {
	avatar: File | null
}

export interface ChatMemberWithUser extends ChatMember {
	user: UserWithAvatar;
}

export interface ChatWithMembers extends Chat {
	members: ChatMemberWithUser[];
}