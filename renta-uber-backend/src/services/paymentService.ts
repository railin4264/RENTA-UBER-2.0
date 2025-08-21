import { PrismaClient, Payment, ContractType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePaymentData {
  contractId?: string;
  driverId: string;
  amount: number;
  type: 'payment' | 'debt';
  method: 'cash' | 'transfer' | 'credit_card' | 'debit_card';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  dueDate?: string;
  description: string;
  reference?: string;
  notes?: string;
}

export interface UpdatePaymentData extends Partial<CreatePaymentData> {}

export interface PaymentWithRelations extends Payment {
  driver?: { id: string; firstName: string; lastName: string };
  contract?: { 
    id: string; 
    basePrice: number | null; 
    dailyPrice: number | null; 
    monthlyPrice: number | null; 
    type: ContractType; 
  };
}

const contractSelect = {
  id: true,
  basePrice: true,
  dailyPrice: true,
  monthlyPrice: true,
  type: true,
};

export const getAllPayments = async (): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const getPaymentById = async (id: string): Promise<PaymentWithRelations | null> => {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    }
  }) as Promise<PaymentWithRelations | null>;
};

export const createPayment = async (paymentData: CreatePaymentData): Promise<PaymentWithRelations> => {
  return prisma.payment.create({
    data: paymentData,
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    }
  }) as Promise<PaymentWithRelations>;
};

export const updatePayment = async (id: string, paymentData: UpdatePaymentData): Promise<PaymentWithRelations> => {
  return prisma.payment.update({
    where: { id },
    data: paymentData,
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    }
  }) as Promise<PaymentWithRelations>;
};

export const deletePayment = async (id: string): Promise<Payment> => {
  return prisma.payment.delete({
    where: { id }
  });
};

export const getPaymentsByDriver = async (driverId: string): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    where: { driverId },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const getPaymentsByContract = async (contractId: string): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    where: { contractId },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const getPaymentsByStatus = async (status: string): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    where: { status: status as any },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const getPaymentsByType = async (type: string): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    where: { type: type as any },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const searchPayments = async (query: string): Promise<PaymentWithRelations[]> => {
  return prisma.payment.findMany({
    where: {
      OR: [
        { description: { contains: query } },
        { reference: { contains: query } },
        { notes: { contains: query } },
        {
          driver: {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } }
            ]
          }
        }
      ]
    },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};

export const getPaymentStats = async () => {
  const totalPayments = await prisma.payment.count();
  const completedPayments = await prisma.payment.count({
    where: { status: 'completed' }
  });
  const pendingPayments = await prisma.payment.count({
    where: { status: 'pending' }
  });

  const totalAmount = await prisma.payment.aggregate({
    where: { status: 'completed' },
    _sum: { amount: true }
  });

  const pendingAmount = await prisma.payment.aggregate({
    where: { status: 'pending' },
    _sum: { amount: true }
  });

  return {
    total: totalPayments,
    completed: completedPayments,
    pending: pendingPayments,
    totalAmount: totalAmount._sum.amount || 0,
    pendingAmount: pendingAmount._sum.amount || 0
  };
};

export const getMonthlyPayments = async (year: number, month: number): Promise<PaymentWithRelations[]> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return prisma.payment.findMany({
    where: {
      date: {
        gte: startDate.toISOString().split('T')[0],
        lte: endDate.toISOString().split('T')[0]
      }
    },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      contract: { select: contractSelect }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PaymentWithRelations[]>;
};
