/*
  Warnings:

  - Added the required column `name` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `label` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `deliveryTime` INTEGER NOT NULL DEFAULT 30,
    ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NOT NULL;
