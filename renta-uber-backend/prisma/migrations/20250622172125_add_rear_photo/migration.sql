/*
  Warnings:

  - You are about to drop the column `photos` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "photos",
ADD COLUMN     "rearPhoto" TEXT;
