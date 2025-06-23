import { PrismaClient, Vehicle } from '@prisma/client';
const prisma = new PrismaClient();

export const createVehicle = async (vehicleData: any) => {
  return prisma.vehicle.create({ data: vehicleData });
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  return prisma.vehicle.update({ where: { id }, data: vehicleData });
};

export const getVehicles = async () => {
  return prisma.vehicle.findMany({
    include: { status: true }, // <-- para traer el status completo
  });
};



export const getVehicleById = async (id: string) => {
  return prisma.vehicle.findUnique({
    where: { id },
    include: { status: true }, // <-- para traer el status completo
  });
};