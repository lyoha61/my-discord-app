-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_messageId_fkey";

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
