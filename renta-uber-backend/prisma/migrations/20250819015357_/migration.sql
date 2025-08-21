/*
  Warnings:

  - You are about to drop the column `driverName` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `vehiclePlate` on the `Contract` table. All the data in the column will be lost.
  - The `type` column on the `Contract` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `statusId` on the `DebtRecord` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `invoice` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `dailySavings` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoEngine` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoFront` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoInterior` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoLeft` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoRear` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `photoRight` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Made the column `cedula` on table `Driver` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('DAILY', 'MONTHLY', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "DebtRecord" DROP CONSTRAINT "DebtRecord_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_driverId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "driverName",
DROP COLUMN "vehiclePlate",
ADD COLUMN     "allowedDelayDays" INTEGER DEFAULT 0,
ADD COLUMN     "automaticRenewal" BOOLEAN DEFAULT false,
ADD COLUMN     "basePrice" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "dailyPrice" DOUBLE PRECISION,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "monthlyPrice" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "penaltyRate" DOUBLE PRECISION,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "terms" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ContractType" NOT NULL DEFAULT 'DAILY';

-- AlterTable
ALTER TABLE "DebtRecord" DROP COLUMN "statusId",
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "vehicleId",
ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "documents" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "licenseExpiry" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "salary" DOUBLE PRECISION,
ALTER COLUMN "cedula" SET NOT NULL;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "invoice",
DROP COLUMN "place",
DROP COLUMN "statusId",
DROP COLUMN "type",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "vendor" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "dailySavings",
DROP COLUMN "statusId",
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" TEXT,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "driverId",
DROP COLUMN "photoEngine",
DROP COLUMN "photoFront",
DROP COLUMN "photoInterior",
DROP COLUMN "photoLeft",
DROP COLUMN "photoRear",
DROP COLUMN "photoRight",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "currentConditionPhotos" TEXT,
ADD COLUMN     "currentValue" DOUBLE PRECISION,
ADD COLUMN     "documents" TEXT,
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "generalPhoto" TEXT,
ADD COLUMN     "insuranceExpiry" TEXT,
ADD COLUMN     "lastMaintenance" TEXT,
ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "nextMaintenance" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "photos" TEXT,
ADD COLUMN     "purchaseDate" TEXT,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "registrationExpiry" TEXT,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "vin" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
