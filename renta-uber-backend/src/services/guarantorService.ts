import { PrismaClient, Guarantor } from '@prisma/client';

const prisma = new PrismaClient();

export const createGuarantor = async (data: Omit<Guarantor, 'id' | 'createdAt'>) => {
  return prisma.guarantor.create({ data });
};

export const getGuarantors = async () => {
  return prisma.guarantor.findMany();
};

export const getGuarantorById = async (id: string) => {
  return prisma.guarantor.findUnique({ where: { id } });
};

export const updateGuarantor = async (id: string, data: Partial<Guarantor>) => {
  return prisma.guarantor.update({ where: { id }, data });
};

export const deleteGuarantor = async (id: string) => {
  return prisma.guarantor.delete({ where: { id } });
};