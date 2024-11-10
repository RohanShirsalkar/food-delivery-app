-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `restaurantId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
