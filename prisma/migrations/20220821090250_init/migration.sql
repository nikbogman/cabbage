/*
  Warnings:

  - Made the column `variantId` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cartId` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `Variant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Variant` DROP FOREIGN KEY `Variant_productId_fkey`;

-- AlterTable
ALTER TABLE `Item` MODIFY `variantId` VARCHAR(191) NOT NULL,
    MODIFY `cartId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `categoryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Variant` MODIFY `productId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
