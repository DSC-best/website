-- CreateEnum
CREATE TYPE "BotApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BANNED');

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "global_name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "badges" TEXT[],
    "approval_status" "BotApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approver_id" TEXT,
    "approval_reason" TEXT,
    "approved_time" TIMESTAMP(3),
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotApprovalLog" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "op_id" TEXT NOT NULL,
    "status" "BotApprovalStatus" NOT NULL,
    "reason" TEXT,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotApprovalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotVote" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_time" TIMESTAMP(3) NOT NULL,
    "botId" TEXT,

    CONSTRAINT "BotVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotApprovalLog" ADD CONSTRAINT "BotApprovalLog_op_id_fkey" FOREIGN KEY ("op_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotVote" ADD CONSTRAINT "BotVote_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotVote" ADD CONSTRAINT "BotVote_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
