import { PrismaClient, Driver } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllDrivers = async (): Promise<Driver[]> => {
  return prisma.driver.findMany();
};

export const getDriverById = async (id: string): Promise<Driver | null> => {
  return prisma.driver.findUnique({ where: { id } });
};

// Cambia aquí:
export const createDriver = async (driverData: any): Promise<Driver> => {
  const { guarantors, ...driverFields } = driverData;
  return prisma.driver.create({
    data: {
      ...driverFields,
      ...(guarantors && guarantors.length > 0
        ? { guarantors: { create: guarantors } }
        : {}),
    },
  });
};

export const updateDriver = async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
  return prisma.driver.update({ where: { id }, data: driverData });
};

export const deleteDriver = async (id: string): Promise<Driver> => {
  return prisma.driver.delete({ where: { id } });
};