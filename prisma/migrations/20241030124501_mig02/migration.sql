/*
  Warnings:

  - You are about to drop the column `restaurant_id` on the `menuitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `restaurant_id`,
    ADD COLUMN `restaurantId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
