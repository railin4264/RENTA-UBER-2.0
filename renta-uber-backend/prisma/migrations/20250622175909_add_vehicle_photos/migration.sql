/*
  Warnings:

  - You are about to drop the column `currentConditionPhotos` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `generalPhoto` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `rearPhoto` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "currentConditionPhotos",
DROP COLUMN "generalPhoto",
DROP COLUMN "rearPhoto",
ADD COLUMN     "photoEngine" TEXT,
ADD COLUMN     "photoFront" TEXT,
ADD COLUMN     "photoInterior" TEXT,
ADD COLUMN     "photoLeft" TEXT,
ADD COLUMN     "photoRear" TEXT,
ADD COLUMN     "photoRight" TEXT;
