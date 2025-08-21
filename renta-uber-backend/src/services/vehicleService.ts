import { PrismaClient, Vehicle } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateVehicleData {
  brand?: string;
  model: string;
  year?: number;
  color?: string;
  plate: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  statusId?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  notes?: string;
  documents?: string;
  photos?: string;
  frontPhoto?: string;
  rearPhoto?: string;
  sidePhoto?: string;
  interiorPhoto?: string;
  enginePhoto?: string;
  currentConditionPhotos?: string;
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {}

export interface VehicleWithRelations extends Vehicle {
  status?: { id: string; name: string; color: string | null };
  contracts?: any[];
  expenses?: any[];
}

export const getAllVehicles = async (): Promise<VehicleWithRelations[]> => {
  return prisma.vehicle.findMany({
    include: {
      status: true,
      contracts: {
        include: {
          driver: true
        }
      },
      expenses: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as Promise<VehicleWithRelations[]>;
};

export const getVehicleById = async (id: string): Promise<VehicleWithRelations | null> => {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      status: true,
      contracts: {
        include: {
          driver: true,
          status: true
        }
      },
      expenses: {
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as Promise<VehicleWithRelations | null>;
};

export const createVehicle = async (vehicleData: CreateVehicleData): Promise<VehicleWithRelations> => {
  const { statusId, ...data } = vehicleData;
  
  return prisma.vehicle.create({
    data: {
      ...data,
      ...(statusId ? { status: { connect: { id: statusId } } } : {})
    },
    include: {
      status: true
    }
  }) as Promise<VehicleWithRelations>;
};

export const updateVehicle = async (id: string, vehicleData: UpdateVehicleData): Promise<VehicleWithRelations> => {
  const { statusId, ...data } = vehicleData;
  
  return prisma.vehicle.update({
    where: { id },
    data: {
      ...data,
      ...(statusId ? { status: { connect: { id: statusId } } } : {})
    },
    include: {
      status: true
    }
  }) as Promise<VehicleWithRelations>;
};

export const deleteVehicle = async (id: string): Promise<Vehicle> => {
  return prisma.vehicle.delete({
    where: { id }
  });
};

export const getVehiclesByStatus = async (statusId: string): Promise<VehicleWithRelations[]> => {
  return prisma.vehicle.findMany({
    where: { statusId },
    include: {
      status: true
    }
  }) as Promise<VehicleWithRelations[]>;
};

export const searchVehicles = async (query: string): Promise<VehicleWithRelations[]> => {
  return prisma.vehicle.findMany({
    where: {
      OR: [
        { brand: { contains: query } },
        { model: { contains: query } },
        { plate: { contains: query } },
        { vin: { contains: query } },
        { color: { contains: query } }
      ]
    },
    include: {
      status: true
    }
  }) as Promise<VehicleWithRelations[]>;
};

export const getVehicleStats = async () => {
  const totalVehicles = await prisma.vehicle.count();
  const availableVehicles = await prisma.vehicle.count({
    where: {
      status: {
        name: 'Disponible'
      }
    }
  });
  const maintenanceVehicles = await prisma.vehicle.count({
    where: {
      status: {
        name: 'En Mantenimiento'
      }
    }
  });

  return {
    total: totalVehicles,
    available: availableVehicles,
    maintenance: maintenanceVehicles,
    inUse: totalVehicles - availableVehicles - maintenanceVehicles
  };
};

export const getVehiclesInMaintenance = async (): Promise<VehicleWithRelations[]> => {
  return prisma.vehicle.findMany({
    where: {
      status: {
        name: 'En Mantenimiento'
      }
    },
    include: {
      status: true
    }
  }) as Promise<VehicleWithRelations[]>;
};