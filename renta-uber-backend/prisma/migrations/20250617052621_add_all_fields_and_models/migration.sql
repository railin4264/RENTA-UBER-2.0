-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cedula" TEXT,
ADD COLUMN     "cedulaPhoto" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googleMapsLink" TEXT,
ADD COLUMN     "licensePhoto" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "vehicleId" TEXT,
ADD COLUMN     "workplace" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentConditionPhotos" TEXT[],
ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "generalPhoto" TEXT,
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "Guarantor" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "photo" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "cedulaPhoto" TEXT,
    "address" TEXT NOT NULL,
    "googleMapsLink" TEXT,
    "workplace" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guarantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtRecord" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "isVehicleInactive" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebtRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtRecord" ADD CONSTRAINT "DebtRecord_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
