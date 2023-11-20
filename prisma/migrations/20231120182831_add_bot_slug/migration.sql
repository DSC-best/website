/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invite` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "invite" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bot_slug_key" ON "Bot"("slug");
