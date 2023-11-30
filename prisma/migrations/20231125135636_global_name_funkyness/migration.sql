-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "global_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "global_name" DROP NOT NULL;
