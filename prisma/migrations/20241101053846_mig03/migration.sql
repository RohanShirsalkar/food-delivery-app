/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `cartId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_userId_key` ON `Cart`(`userId`);

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
