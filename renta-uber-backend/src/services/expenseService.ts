import { PrismaClient, Expense } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateExpenseData {
  vehicleId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  vendor: string;
  invoiceNumber?: string;
  paymentMethod: string;
  status: string;
  notes?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

export interface ExpenseWithRelations extends Expense {
  vehicle?: { id: string; brand: string | null; model: string; plate: string };
}

export const getAllExpenses = async (): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const getExpenseById = async (id: string): Promise<ExpenseWithRelations | null> => {
  return prisma.expense.findUnique({
    where: { id },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    }
  }) as Promise<ExpenseWithRelations | null>;
};

export const createExpense = async (expenseData: CreateExpenseData): Promise<ExpenseWithRelations> => {
  return prisma.expense.create({
    data: expenseData,
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    }
  }) as Promise<ExpenseWithRelations>;
};

export const updateExpense = async (id: string, expenseData: UpdateExpenseData): Promise<ExpenseWithRelations> => {
  return prisma.expense.update({
    where: { id },
    data: expenseData,
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    }
  }) as Promise<ExpenseWithRelations>;
};

export const deleteExpense = async (id: string): Promise<Expense> => {
  return prisma.expense.delete({
    where: { id }
  });
};

export const getExpensesByVehicle = async (vehicleId: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: { vehicleId },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const getExpensesByCategory = async (category: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: { category },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const getExpensesByStatus = async (status: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: { status },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const getExpensesByDateRange = async (startDate: string, endDate: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const searchExpenses = async (query: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: {
      OR: [
        { description: { contains: query } },
        { vendor: { contains: query } },
        { invoiceNumber: { contains: query } },
        { notes: { contains: query } },
        {
          vehicle: {
            OR: [
              { brand: { contains: query } },
              { model: { contains: query } },
              { plate: { contains: query } }
            ]
          }
        }
      ]
    },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};

export const getExpenseStats = async () => {
  const totalExpenses = await prisma.expense.count();
  const totalAmount = await prisma.expense.aggregate({
    _sum: { amount: true }
  });

  const categoryStats = await prisma.expense.groupBy({
    by: ['category'],
    _sum: { amount: true },
    _count: true
  });

  const monthlyStats = await prisma.expense.groupBy({
    by: ['date'],
    _sum: { amount: true },
    _count: true
  });

  return {
    total: totalExpenses,
    totalAmount: totalAmount._sum.amount || 0,
    categoryStats,
    monthlyStats
  };
};

export const getExpensesByVehicleAndDateRange = async (vehicleId: string, startDate: string, endDate: string): Promise<ExpenseWithRelations[]> => {
  return prisma.expense.findMany({
    where: {
      vehicleId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<ExpenseWithRelations[]>;
};