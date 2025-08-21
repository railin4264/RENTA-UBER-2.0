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
    include: { driver: true },
  });
};

export const getDebtRecordById = async (id: string) => {
  return prisma.debtRecord.findUnique({
    where: { id },
    include: { driver: true },
  });
};

export const deleteDebtRecord = async (id: string) => {
  return prisma.debtRecord.delete({ where: { id } });
};