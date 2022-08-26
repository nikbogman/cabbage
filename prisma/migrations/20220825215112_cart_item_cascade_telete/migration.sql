-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_cartId_fkey`;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
