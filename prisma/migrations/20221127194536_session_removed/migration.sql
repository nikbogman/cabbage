/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_sessionId_fkey`;

-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `sessionId`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `Session`;
