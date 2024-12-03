/*
  Warnings:

  - Made the column `restaurantId` on table `orderitem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_restaurantId_fkey`;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `restaurantId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
