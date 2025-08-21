import { PrismaClient, Contract, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateContractData {
  tenantId?: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate?: string;
  type?: 'DAILY' | 'MONTHLY' | 'CUSTOM';
  basePrice?: number;
  dailyPrice?: number;
  monthlyPrice?: number;
  deposit?: number;
  penaltyRate?: number;
  allowedDelayDays?: number;
  automaticRenewal?: boolean;
  statusId?: string;
  terms?: string;
  notes?: string;
  createdBy?: string;
}

export type UpdateContractData = Partial<CreateContractData>;

export interface ContractWithRelations extends Contract {
  driver?: { id: string; firstName: string; lastName: string };
  vehicle?: { id: string; brand: string | null; model: string; plate: string };
  status?: { id: string; name: string; color: string | null };
  payments?: Array<{ id: string; amount: number; type: string; status?: string; date: Date }>;
}

function parseDateStrict(d: string): Date {
  const date = new Date(d);
  if (isNaN(date.getTime())) throw new Error('Invalid date format');
  return date;
}

function parseDateOptional(d?: string): Date | undefined {
  if (!d) return undefined;
  return parseDateStrict(d);
}

/**
 * Check for overlapping contracts for a vehicle or driver in the given range.
 */
async function hasOverlap(vehicleId: string, driverId: string, startDate: Date, endDate?: Date) {
  // Build a where clause that finds contracts that overlap the given range for the same vehicle or driver
  const where: Prisma.ContractWhereInput = {
    AND: [
      { OR: [{ vehicleId }, { driverId }] },
      { startDate: { lte: endDate ?? new Date('9999-12-31') } },
      { OR: [{ endDate: { gte: startDate } }, { endDate: null }] }
    ]
  };

  const count = await prisma.contract.count({ where });
  return count > 0;
}

export const listContracts = async (options: {
  page?: number;
  limit?: number;
  statusId?: string;
  driverId?: string;
  vehicleId?: string;
  q?: string;
  from?: string;
  to?: string;
  sort?: string;
}) => {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, options.limit ?? 20);
  const skip = (page - 1) * limit;

  const where: Prisma.ContractWhereInput = {};
  if (options.statusId) where.statusId = options.statusId;
  if (options.driverId) where.driverId = options.driverId;
  if (options.vehicleId) where.vehicleId = options.vehicleId;
  if (options.from || options.to) {
    where.AND = [];
    if (options.from) where.AND.push({ startDate: { gte: parseDateStrict(options.from!) } });
    if (options.to) where.AND.push({ endDate: { lte: parseDateStrict(options.to!) } });
  }
  if (options.q) {
    where.OR = [
      { terms: { contains: options.q } },
      { notes: { contains: options.q } },
      { driver: { firstName: { contains: options.q } } },
      { driver: { lastName: { contains: options.q } } },
      { vehicle: { brand: { contains: options.q } } },
      { vehicle: { model: { contains: options.q } } },
      { vehicle: { plate: { contains: options.q } } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.contract.findMany({
      where,
      include: {
        driver: { select: { id: true, firstName: true, lastName: true } },
        status: true,
        payments: { orderBy: { createdAt: 'desc' } },
        vehicle: { select: { id: true, brand: true, model: true, plate: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.contract.count({ where })
  ]);

  return {
    data: data as ContractWithRelations[],
    meta: { page, limit, total }
  };
};

export const getAllContracts = async (): Promise<ContractWithRelations[]> => {
  const res = await listContracts({ page: 1, limit: 100 });
  return res.data;
};

export const getContractById = async (id: string): Promise<ContractWithRelations | null> => {
  return prisma.contract.findUnique({
    where: { id },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    }
  }) as Promise<ContractWithRelations | null>;
};

export const createContract = async (contractData: CreateContractData): Promise<ContractWithRelations> => {
  const {
    driverId,
    vehicleId,
    startDate,
    endDate,
    type,
    basePrice,
    dailyPrice,
    monthlyPrice,
    deposit,
    statusId,
    terms,
    notes
  } = contractData;

  const sDate = parseDateStrict(startDate);
  const eDate = endDate ? parseDateStrict(endDate) : undefined;

  if (eDate && sDate > eDate) throw new Error('startDate must be before endDate');

  // Validate existence of driver and vehicle
  const [driver, vehicle] = await Promise.all([
    prisma.driver.findUnique({ where: { id: driverId } }),
    prisma.vehicle.findUnique({ where: { id: vehicleId } })
  ]);
  if (!driver) throw new Error('Driver not found');
  if (!vehicle) throw new Error('Vehicle not found');

  // If vehicle has a status and it's not available, reject
  if (vehicle.statusId) {
    const vStatus = await prisma.status.findUnique({ where: { id: vehicle.statusId } });
    if (vStatus && vStatus.name.toLowerCase() !== 'disponible' && vStatus.name.toLowerCase() !== 'available') {
      throw new Error('Vehicle is not available for new contracts');
    }
  }

  // Check overlapping contracts
  const overlap = await hasOverlap(vehicleId, driverId, sDate, eDate);
  if (overlap) throw new Error('Vehicle or driver already has a conflicting contract in the requested period');

  // Use transaction to create contract and initial payment (deposit) atomically
  return prisma.$transaction(async (tx) => {
    const created = await tx.contract.create({
      data: {
        driverId,
        vehicleId,
        startDate: sDate,
        endDate: eDate,
        basePrice,
        dailyPrice,
        monthlyPrice,
        type,
        deposit,
        statusId,
        terms,
        notes
      }
    });

    if (deposit && deposit > 0) {
      await tx.payment.create({
        data: {
          contractId: created.id,
          driverId,
          amount: deposit,
          type: 'deposit',
          status: 'pending',
          date: new Date()
        }
      });
    }

    return tx.contract.findUnique({
      where: { id: created.id },
      include: {
        driver: { select: { id: true, firstName: true, lastName: true } },
        status: true,
        payments: { orderBy: { createdAt: 'desc' } },
        vehicle: { select: { id: true, brand: true, model: true, plate: true } }
      }
    }) as Promise<ContractWithRelations>;
  });
};

export const updateContract = async (id: string, contractData: UpdateContractData): Promise<ContractWithRelations> => {
  const { statusId, ...data } = contractData;
  
  return prisma.contract.update({
    where: { id },
    data: {
      ...data,
      ...(statusId ? { statusId } : {})
    },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true
        }
      }
    }
  }) as Promise<ContractWithRelations>;
};

export const deleteContract = async (id: string): Promise<Contract> => {
  return prisma.contract.delete({
    where: { id }
  });
};

export const getContractsByDriver = async (driverId: string): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: { driverId },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const getContractsByVehicle = async (vehicleId: string): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: { vehicleId },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const getContractsByStatus = async (statusId: string): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: { statusId },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const getActiveContracts = async (): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: {
      status: {
        name: 'Vigente'
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
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const getExpiredContracts = async (): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: {
      status: {
        name: 'Vencido'
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
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const searchContracts = async (query: string): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where: {
      OR: [
        { terms: { contains: query } },
        { notes: { contains: query } },
        {
          driver: {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } }
            ]
          }
        },
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
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      status: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
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
  }) as Promise<ContractWithRelations[]>;
};

export const getContractStats = async () => {
  const totalContracts = await prisma.contract.count();
  const activeContracts = await prisma.contract.count({
    where: {
      status: {
        name: 'Vigente'
      }
    }
  });
  const expiredContracts = await prisma.contract.count({
    where: {
      status: {
        name: 'Vencido'
      }
    }
  });

  return {
    total: totalContracts,
    active: activeContracts,
    expired: expiredContracts
  };
};