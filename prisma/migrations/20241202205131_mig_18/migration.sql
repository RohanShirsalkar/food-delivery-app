/*
  Warnings:

  - You are about to drop the column `orderId` on the `orderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `orderId`;

-- CreateTable
CREATE TABLE `_OrderToOrderItem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_OrderToOrderItem_AB_unique`(`A`, `B`),
    INDEX `_OrderToOrderItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OrderToOrderItem` ADD CONSTRAINT `_OrderToOrderItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToOrderItem` ADD CONSTRAINT `_OrderToOrderItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
