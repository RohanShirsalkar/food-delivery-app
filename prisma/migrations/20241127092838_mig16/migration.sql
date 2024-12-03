/*
  Warnings:

  - You are about to drop the column `menuItemId` on the `orderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_menuItemId_fkey`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `menuItemId`;

-- CreateTable
CREATE TABLE `_MenuItemToOrderItem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MenuItemToOrderItem_AB_unique`(`A`, `B`),
    INDEX `_MenuItemToOrderItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MenuItemToOrderItem` ADD CONSTRAINT `_MenuItemToOrderItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `MenuItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuItemToOrderItem` ADD CONSTRAINT `_MenuItemToOrderItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
