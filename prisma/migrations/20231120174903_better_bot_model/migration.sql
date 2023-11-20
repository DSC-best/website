/*
  Warnings:

  - You are about to drop the column `badges` on the `Bot` table. All the data in the column will be lost.
  - Added the required column `description` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "badges",
ADD COLUMN     "description" VARCHAR(4000) NOT NULL,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "guild_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "links" TEXT[],
ADD COLUMN     "privacy_link" TEXT,
ADD COLUMN     "shard_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tagline" VARCHAR(500) NOT NULL,
ADD COLUMN     "tos_link" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
