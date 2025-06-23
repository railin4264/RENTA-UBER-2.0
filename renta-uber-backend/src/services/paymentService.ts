import { PrismaClient } from '@prisma/client';
import type { Payment } from '@prisma/client';

const prisma = new PrismaClient();

export const createPayment = async (paymentData: any) => {
  return prisma.payment.create({ data: paymentData });
};

export const updatePayment = async (id: string, paymentData: any) => {
  return prisma.payment.update({ where: { id }, data: paymentData });
};

export const getPayments = async () => {
  return prisma.payment.findMany({
    include: { status: true }, // <-- para traer el status completo
  });
};

export const getPaymentById = async (id: string) => {
  return prisma.payment.findUnique({
    where: { id },
    include: { status: true }, // <-- para traer el status completo
  });
};

export const deletePayment = async (id: string): Promise<Payment> => {
  return prisma.payment.delete({ where: { id } });
};