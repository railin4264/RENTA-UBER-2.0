import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateReportData {
  title: string;
  description: string;
  data: any;
}

export interface ReportWithData {
  id: string;
  title: string;
  description: string;
  data: any;
  createdAt: Date;
}

export const createReport = async (reportData: CreateReportData): Promise<ReportWithData> => {
  return prisma.report.create({
    data: reportData
  });
};

export const getAllReports = async (): Promise<ReportWithData[]> => {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getReportById = async (id: string): Promise<ReportWithData | null> => {
  return prisma.report.findUnique({
    where: { id }
  });
};

export const deleteReport = async (id: string): Promise<any> => {
  return prisma.report.delete({ where: { id } });
};

// Reportes específicos del negocio
export const generateFinancialReport = async (startDate: Date, endDate: Date) => {
  const payments = await prisma.payment.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      },
      status: 'completed'
    }
  });

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      },
      status: 'paid'
    }
  });

  const totalIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return {
    period: { startDate, endDate },
    income: {
      total: totalIncome,
      payments: payments.length,
      averagePayment: payments.length > 0 ? totalIncome / payments.length : 0
    },
    expenses: {
      total: totalExpenses,
      count: expenses.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0
    },
    profit: {
      net: netProfit,
      margin: totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
    }
  };
};

export const generateDriverReport = async (driverId: string, startDate: Date, endDate: Date) => {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      payments: {
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'desc' }
      },
      contracts: {
        where: {
          startDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          vehicle: true,
          payments: true
        }
      }
    }
  });

  if (!driver) {
    throw new Error('Conductor no encontrado');
  }

  const totalPayments = driver.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeContracts = driver.contracts.filter(contract => contract.statusId);

  return {
    driver: {
      id: driver.id,
      name: `${driver.firstName} ${driver.lastName}`,
      cedula: driver.cedula,
      phone: driver.phone
    },
    period: { startDate, endDate },
    payments: {
      total: totalPayments,
      count: driver.payments.length,
      average: driver.payments.length > 0 ? totalPayments / driver.payments.length : 0
    },
    contracts: {
      total: driver.contracts.length,
      active: activeContracts.length
    }
  };
};

export const generateVehicleReport = async (vehicleId: string, startDate: Date, endDate: Date) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      expenses: {
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'desc' }
      },
      contracts: {
        where: {
          startDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          driver: true,
          payments: true
        }
      }
    }
  });

  if (!vehicle) {
    throw new Error('Vehículo no encontrado');
  }

  const totalExpenses = vehicle.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = vehicle.contracts.reduce((sum, contract) => {
    return sum + contract.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
  }, 0);

  return {
    vehicle: {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate
    },
    period: { startDate, endDate },
    expenses: {
      total: totalExpenses,
      count: vehicle.expenses.length,
      byCategory: vehicle.expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as any)
    },
    income: {
      total: totalIncome,
      contracts: vehicle.contracts.length
    },
    profit: totalIncome - totalExpenses
  };
};

export const generateMaintenanceReport = async () => {
  const vehiclesNeedingMaintenance = await prisma.vehicle.findMany({
    where: {
      nextMaintenance: {
        not: null
      }
    },
    include: {
      expenses: {
        where: {
          category: 'maintenance'
        },
        orderBy: { date: 'desc' }
      }
    }
  });

  const maintenanceStats = await prisma.expense.groupBy({
    by: ['category'],
    where: {
      category: 'maintenance'
    },
    _sum: { amount: true },
    _count: true
  });

  return {
    vehiclesNeedingMaintenance: vehiclesNeedingMaintenance.length,
    vehicles: vehiclesNeedingMaintenance.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      nextMaintenance: vehicle.nextMaintenance,
      lastMaintenance: vehicle.lastMaintenance,
      totalMaintenanceExpenses: vehicle.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    })),
    stats: maintenanceStats
  };
};

export const generatePaymentReport = async (startDate: Date, endDate: Date) => {
  const payments = await prisma.payment.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      driver: true,
      contract: {
        include: {
          vehicle: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  const paymentStats = await prisma.payment.groupBy({
    by: ['status', 'type'],
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    _sum: { amount: true },
    _count: true
  });

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
    byStatus: paymentStats.filter(stat => stat.status),
    byType: paymentStats.filter(stat => stat.type),
    payments: payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      type: payment.type,
      status: payment.status,
      date: payment.date,
      driver: payment.driver ? `${payment.driver.firstName} ${payment.driver.lastName}` : 'N/A',
      vehicle: payment.contract?.vehicle ? `${payment.contract.vehicle.brand} ${payment.contract.vehicle.model}` : 'N/A'
    }))
  };
};

export const generateDashboardReport = async () => {
  const [
    totalDrivers,
    activeDrivers,
    totalVehicles,
    availableVehicles,
    totalContracts,
    activeContracts,
    totalPayments,
    completedPayments,
    totalExpenses
  ] = await Promise.all([
    prisma.driver.count(),
    prisma.driver.count({
      where: {
        status: {
          name: 'Activo'
        }
      }
    }),
    prisma.vehicle.count(),
    prisma.vehicle.count({
      where: {
        status: {
          name: 'Disponible'
        }
      }
    }),
    prisma.contract.count(),
    prisma.contract.count({
      where: {
        status: {
          name: 'Vigente'
        }
      }
    }),
    prisma.payment.count(),
    prisma.payment.count({
      where: {
        status: 'completed'
      }
    }),
    prisma.expense.count()
  ]);

  const monthlyIncome = await prisma.payment.aggregate({
    where: {
      status: 'completed',
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    },
    _sum: { amount: true }
  });

  const monthlyExpenses = await prisma.expense.aggregate({
    where: {
      status: 'paid',
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    },
    _sum: { amount: true }
  });

  return {
    drivers: {
      total: totalDrivers,
      active: activeDrivers,
      inactive: totalDrivers - activeDrivers
    },
    vehicles: {
      total: totalVehicles,
      available: availableVehicles,
      inUse: totalVehicles - availableVehicles
    },
    contracts: {
      total: totalContracts,
      active: activeContracts,
      expired: totalContracts - activeContracts
    },
    payments: {
      total: totalPayments,
      completed: completedPayments,
      pending: totalPayments - completedPayments
    },
    expenses: {
      total: totalExpenses
    },
    monthly: {
      income: monthlyIncome._sum.amount || 0,
      expenses: monthlyExpenses._sum.amount || 0,
      profit: (monthlyIncome._sum.amount || 0) - (monthlyExpenses._sum.amount || 0)
    }
  };
};