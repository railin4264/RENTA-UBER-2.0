import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();



export const createExpense = async (expenseData: any) => {
  return prisma.expense.create({ data: expenseData });
};

export const updateExpense = async (id: string, expenseData: any) => {
  return prisma.expense.update({ where: { id }, data: expenseData });
};

export const getAllExpenses = async () => {
  return prisma.expense.findMany({
    include: { status: true }, // <-- para traer el status completo
  });
};

export const getExpenseById = async (id: string) => {
  return prisma.expense.findUnique({
    where: { id },
    include: { status: true }, // <-- para traer el status completo
  });
};

export const deleteExpense = async (id: string) => {
  return prisma.expense.delete({ where: { id } });
};