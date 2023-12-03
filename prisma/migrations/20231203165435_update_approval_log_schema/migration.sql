-- AddForeignKey
ALTER TABLE "BotApprovalLog" ADD CONSTRAINT "BotApprovalLog_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
