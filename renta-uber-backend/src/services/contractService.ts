import { PrismaClient } from '@prisma/client';
import type { Contract } from '@prisma/client';

const prisma = new PrismaClient();

export const createContract = async (data: any) => {
  return prisma.contract.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
    include: { status: true },
  });
};

export const getContracts = async (): Promise<Contract[]> => {
  return prisma.contract.findMany({
    include: { status: true }, // <-- para traer el status completo
  });
};


export const getContractById = async (id: string): Promise<Contract | null> => {
  return prisma.contract.findUnique({
    where: { id },
    include: { status: true }, // <-- para traer el status completo
  });
};


export const updateContract = async (id: string, contractData: Partial<Contract>) => {
  return prisma.contract.update({
    where: { id },
    data: {
      ...contractData,
      statusId: contractData.statusId, // Permite actualizar el status
    },
  });
};

export const deleteContract = async (id: string): Promise<Contract> => {
  return prisma.contract.delete({ where: { id } }); 
};