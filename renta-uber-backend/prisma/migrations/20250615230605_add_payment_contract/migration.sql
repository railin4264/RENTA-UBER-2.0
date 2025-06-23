/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `cedula` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `cedulaPhoto` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `googleMapsLink` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `licensePhoto` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `workplace` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `dailySaving` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `currentConditionPhotos` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `generalPhoto` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `DebtRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guarantor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "DebtRecord" DROP CONSTRAINT "DebtRecord_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Guarantor" DROP CONSTRAINT "Guarantor_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_driverId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "createdAt",
DROP COLUMN "status",
DROP COLUMN "terms";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "address",
DROP COLUMN "cedula",
DROP COLUMN "cedulaPhoto",
DROP COLUMN "createdAt",
DROP COLUMN "googleMapsLink",
DROP COLUMN "licensePhoto",
DROP COLUMN "photo",
DROP COLUMN "startDate",
DROP COLUMN "workplace";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdAt",
DROP COLUMN "dailySaving",
DROP COLUMN "description",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "color",
DROP COLUMN "createdAt",
DROP COLUMN "currentConditionPhotos",
DROP COLUMN "generalPhoto",
DROP COLUMN "photos",
DROP COLUMN "year";

-- DropTable
DROP TABLE "DebtRecord";

-- DropTable
DROP TABLE "Expense";

-- DropTable
DROP TABLE "Guarantor";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
