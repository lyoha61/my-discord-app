-- DropForeignKey
ALTER TABLE "public"."chats_members" DROP CONSTRAINT "chats_members_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chats_members" DROP CONSTRAINT "chats_members_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."chats_members" ADD CONSTRAINT "chats_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats_members" ADD CONSTRAINT "chats_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
