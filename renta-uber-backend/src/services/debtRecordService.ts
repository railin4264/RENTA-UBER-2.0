import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createDebtRecord = async (data: Prisma.DebtRecordCreateInput) => {
  return prisma.debtRecord.create({ data });
};

export const updateDebtRecord = async (id: string, data: Prisma.DebtRecordUpdateInput) => {
  return prisma.debtRecord.update({ where: { id }, data });
};

export const getDebtRecords = async () => {
  return prisma.debtRecord.findMany({
    include: { status: true }, // <-- para traer el status completo
  });
};

export const getDebtRecordById = async (id: string) => {
  return prisma.debtRecord.findUnique({
    where: { id },
    include: { status: true }, // <-- para traer el status completo
  });
};

export const deleteDebtRecord = async (id: string) => {
  return prisma.debtRecord.delete({ where: { id } });
};