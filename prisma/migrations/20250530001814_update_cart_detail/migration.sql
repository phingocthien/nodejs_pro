/*
  Warnings:

  - You are about to drop the `cartcartdetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cartcartdetails` DROP FOREIGN KEY `cartCartDetails_cart_id_fkey`;

-- DropForeignKey
ALTER TABLE `cartcartdetails` DROP FOREIGN KEY `cartCartDetails_product_id_fkey`;

-- DropTable
DROP TABLE `cartcartdetails`;

-- CreateTable
CREATE TABLE `cartDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `cart_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,

    UNIQUE INDEX `cartDetails_cart_id_product_id_key`(`cart_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cartDetails` ADD CONSTRAINT `cartDetails_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartDetails` ADD CONSTRAINT `cartDetails_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
