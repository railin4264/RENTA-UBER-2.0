import { PrismaClient, Driver, Guarantor } from '@prisma/client';
import { logError, logInfo, logDatabaseOperation, logValidation, logWarning } from '../middlewares/logging';

const prisma = new PrismaClient();

export interface CreateDriverData {
  firstName: string;
  lastName: string;
  cedula: string;
  license: string;
  phone: string;
  email?: string;
  address?: string;
  googleMapsLink?: string;
  workplace?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  salary?: number;
  commission?: number;
  notes?: string;
  statusId?: string;
  photo?: string;
  cedulaPhoto?: string;
  licensePhoto?: string;
  licenseExpiry?: string;
  startDate?: Date;
  documents?: string;
  guarantors?: Omit<Guarantor, 'id' | 'driverId' | 'createdAt'>[];
}

export interface UpdateDriverData extends Partial<CreateDriverData> {}

export interface DriverWithRelations extends Driver {
  status?: { id: string; name: string; color: string | null };
  guarantors?: Guarantor[];
  payments?: any[];
  contracts?: any[];
}

export const getAllDrivers = async (): Promise<DriverWithRelations[]> => {
  return prisma.driver.findMany({
    include: {
      status: true,
      guarantors: true,
      payments: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      contracts: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as Promise<DriverWithRelations[]>;
};

export const getDriverById = async (id: string): Promise<DriverWithRelations | null> => {
  return prisma.driver.findUnique({
    where: { id },
    include: {
      status: true,
      guarantors: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
      contracts: {
        include: {
          vehicle: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as Promise<DriverWithRelations | null>;
};

export const createDriver = async (driverData: CreateDriverData): Promise<DriverWithRelations> => {
  try {
    logInfo(`Iniciando creación de conductor`);
    logInfo(`Datos recibidos: ${JSON.stringify(driverData)}`);

    const { guarantors, ...driverFields } = driverData;
    
    // Preparar los datos para la creación
    const createData: any = { ...driverFields };
    
    // Manejar campos específicos
    if (driverFields.startDate) {
      createData.startDate = new Date(driverFields.startDate);
      logValidation('startDate', driverFields.startDate, true, 'Convertido a Date');
    }
    
    if (driverFields.salary !== undefined) {
      createData.salary = parseFloat(driverFields.salary.toString());
      logValidation('salary', driverFields.salary, true, 'Convertido a Float');
    }
    
    if (driverFields.commission !== undefined) {
      createData.commission = parseFloat(driverFields.commission.toString());
      logValidation('commission', driverFields.commission, true, 'Convertido a Float');
    }
    
    // Remover campos undefined para evitar errores de Prisma
    // Sanitizar campos de fotos: si no son string, remover
    ['photo', 'cedulaPhoto', 'licensePhoto', 'documents'].forEach((field) => {
      if (field in createData && typeof createData[field] !== 'string') {
        delete createData[field];
        logInfo(`Campo removido: ${field} (no es string)`);
      }
    });

    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined || createData[key] === null) {
        delete createData[key];
        logInfo(`Campo removido: ${key} (undefined/null)`);
      }
    });

    logInfo(`Datos finales para creación: ${JSON.stringify(createData)}`);
    logDatabaseOperation('CREATE', 'Driver', createData);

    const result = await prisma.driver.create({
      data: {
        ...createData,
        ...(guarantors && guarantors.length > 0
          ? { guarantors: { create: guarantors } }
          : {}),
      },
      include: {
        status: true,
        guarantors: true
      }
    });

    const createdDriver = result as unknown as DriverWithRelations;
    logInfo(`Conductor creado exitosamente: ${createdDriver.id}`);
    return createdDriver;
  } catch (error) {
    logError(error, `createDriver`);
    throw error;
  }
};

export const updateDriver = async (id: string, driverData: UpdateDriverData): Promise<DriverWithRelations> => {
  try {
    logInfo(`Iniciando actualización del conductor ID: ${id}`);
    logInfo(`Datos recibidos: ${JSON.stringify(driverData)}`);

    const { guarantors, startDate, ...driverFields } = driverData;
    
    // Preparar los datos para la actualización
    const updateData: any = { ...driverFields };
    
    // Manejar campos específicos
    if (startDate) {
      updateData.startDate = new Date(startDate);
      logValidation('startDate', startDate, true, 'Convertido a Date');
    }
    
    if (driverFields.salary !== undefined) {
      updateData.salary = parseFloat(driverFields.salary.toString());
      logValidation('salary', driverFields.salary, true, 'Convertido a Float');
    }
    
    if (driverFields.commission !== undefined) {
      updateData.commission = parseFloat(driverFields.commission.toString());
      logValidation('commission', driverFields.commission, true, 'Convertido a Float');
    }
    
    // Remover campos undefined para evitar errores de Prisma
    // Sanitizar campos de fotos: si no son string, remover
    ['photo', 'cedulaPhoto', 'licensePhoto', 'documents'].forEach((field) => {
      if (field in updateData && typeof updateData[field] !== 'string') {
        delete updateData[field];
        logInfo(`Campo removido: ${field} (no es string)`);
      }
    });

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
        logInfo(`Campo removido: ${key} (undefined/null)`);
      }
    });

    logInfo(`Datos finales para actualización: ${JSON.stringify(updateData)}`);
    logDatabaseOperation('UPDATE', 'Driver', { id, updateData });

    // Si hay guarantors, actualizar o crear
    if (guarantors && guarantors.length > 0) {
      logInfo(`Actualizando ${guarantors.length} garante(s) para conductor ${id}`);
      
      // Eliminar guarantors existentes
      await prisma.guarantor.deleteMany({
        where: { driverId: id }
      });

      // Crear nuevos guarantors
      await prisma.guarantor.createMany({
        data: guarantors.map(guarantor => ({
          ...guarantor,
          driverId: id
        }))
      });
    }

    const result = await prisma.driver.update({
      where: { id },
      data: updateData,
      include: {
        status: true,
        guarantors: true
      }
    });
    const updatedDriver = result as unknown as DriverWithRelations;
    logInfo(`Conductor actualizado exitosamente: ${id}`);
    return updatedDriver;
  } catch (error) {
    logError(error, `updateDriver - ID: ${id}`);
    throw error;
  }
};

export const deleteDriver = async (id: string): Promise<{ canDelete: boolean; reason?: string; details?: any }> => {
  try {
    logInfo(`Iniciando proceso de eliminación del conductor ID: ${id}`);
    
    // Verificar si el conductor tiene registros relacionados
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        contracts: {
          include: {
            status: true,
            vehicle: true
          }
        },
        payments: true,
        guarantors: true
      }
    });

    if (!driver) {
      logError(new Error('Conductor no encontrado'), `deleteDriver - ID: ${id}`);
      throw new Error('Conductor no encontrado');
    }

    logInfo(`Conductor encontrado: ${driver.firstName} ${driver.lastName}`);
    logInfo(`Contratos: ${driver.contracts.length}, Pagos: ${driver.payments.length}, Garantes: ${driver.guarantors.length}`);

    const issues = [];

    // Verificar contratos activos
    const activeContracts = driver.contracts.filter(contract => 
      contract.status?.name === 'Vigente' || contract.status?.name === 'Activo'
    );

    if (activeContracts.length > 0) {
      logWarning(`Conductor ${id} tiene ${activeContracts.length} contrato(s) activo(s)`);
      issues.push({
        type: 'contracts',
        count: activeContracts.length,
        message: `Tiene ${activeContracts.length} contrato(s) activo(s)`,
        details: activeContracts.map(contract => ({
          id: contract.id,
          vehicle: contract.vehicle?.plate || 'Sin vehículo',
          status: contract.status?.name || 'Desconocido',
          startDate: contract.startDate,
          endDate: contract.endDate
        }))
      });
    }

    // Verificar pagos pendientes
    const pendingPayments = driver.payments.filter(payment => 
      payment.status === 'Pendiente' || payment.status === 'pending'
    );

    if (pendingPayments.length > 0) {
      logWarning(`Conductor ${id} tiene ${pendingPayments.length} pago(s) pendiente(s)`);
      issues.push({
        type: 'payments',
        count: pendingPayments.length,
        message: `Tiene ${pendingPayments.length} pago(s) pendiente(s)`,
        details: pendingPayments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          date: payment.date,
          status: payment.status
        }))
      });
    }

    // Si hay problemas, no se puede eliminar
    if (issues.length > 0) {
      logInfo(`Eliminación cancelada para conductor ${id}: ${issues.length} problema(s) encontrado(s)`);
      return {
        canDelete: false,
        reason: `No se puede eliminar el conductor porque: ${issues.map(issue => issue.message).join(', ')}`,
        details: issues
      };
    }

    // Si no hay problemas, proceder con la eliminación
    logInfo(`Procediendo con eliminación en cascada para conductor ${id}`);
    
    logDatabaseOperation('DELETE_MANY', 'Payment', { driverId: id });
    await prisma.payment.deleteMany({
      where: { driverId: id }
    });

    logDatabaseOperation('DELETE_MANY', 'Contract', { driverId: id });
    await prisma.contract.deleteMany({
      where: { driverId: id }
    });

    logDatabaseOperation('DELETE_MANY', 'Guarantor', { driverId: id });
    await prisma.guarantor.deleteMany({
      where: { driverId: id }
    });

    logDatabaseOperation('DELETE', 'Driver', { id });
    await prisma.driver.delete({
      where: { id }
    });

    logInfo(`Conductor ${id} eliminado exitosamente`);
    return {
      canDelete: true,
      reason: 'Conductor eliminado exitosamente'
    };
  } catch (error) {
    logError(error, `deleteDriver - ID: ${id}`);
    throw error;
  }
};

export const getDriversByStatus = async (statusId: string): Promise<DriverWithRelations[]> => {
  return prisma.driver.findMany({
    where: { statusId },
    include: {
      status: true,
      guarantors: true
    }
  }) as Promise<DriverWithRelations[]>;
};

export const searchDrivers = async (query: string): Promise<DriverWithRelations[]> => {
  return prisma.driver.findMany({
    where: {
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { cedula: { contains: query } },
        { license: { contains: query } },
        { phone: { contains: query } },
        { email: { contains: query } }
      ]
    },
    include: {
      status: true,
      guarantors: true
    }
  }) as Promise<DriverWithRelations[]>;
};

export const getDriverStats = async () => {
  const totalDrivers = await prisma.driver.count();
  const activeDrivers = await prisma.driver.count({
    where: {
      status: {
        name: 'Activo'
      }
    }
  });

  return {
    total: totalDrivers,
    active: activeDrivers,
    inactive: totalDrivers - activeDrivers
  };
};