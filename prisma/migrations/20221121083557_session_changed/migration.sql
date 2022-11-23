/*
  Warnings:

  - You are about to drop the column `availability` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `committed` on the `Variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `sessionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Variant` DROP COLUMN `availability`,
    DROP COLUMN `committed`;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_sessionId_key` ON `Cart`(`sessionId`);

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
