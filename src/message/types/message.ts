import { Message, User } from "@prisma/client";

export type MessageWithAuthor = Message & { author: User }
