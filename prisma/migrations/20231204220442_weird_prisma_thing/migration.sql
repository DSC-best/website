/*
  Warnings:

  - You are about to drop the column `botId` on the `BotVote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BotVote" DROP CONSTRAINT "BotVote_botId_fkey";

-- AlterTable
ALTER TABLE "BotVote" DROP COLUMN "botId";

-- AddForeignKey
ALTER TABLE "BotVote" ADD CONSTRAINT "BotVote_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
