/*
  Warnings:

  - A unique constraint covering the columns `[avatar_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "public"."users"("avatar_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
