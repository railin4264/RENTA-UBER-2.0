import { Request, Response } from 'express';
import * as driverService from '../services/driverService';
import { asyncHandler } from '../utils/errorHandler';
import { logError, logInfo } from '../middlewares/logging';

// Obtener todos los conductores
export const getAllDrivers = asyncHandler(async (req: Request, res: Response) => {
  const drivers = await driverService.getAllDrivers();
  
  res.json({
    success: true,
    data: drivers,
    count: drivers.length
  });
});

// Obtener conductor por ID
export const getDriverById = asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.getDriverById(req.params.id);
  
  if (!driver) {
    return res.status(404).json({
      success: false,
      message: 'Conductor no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: driver
  });
});

// Crear nuevo conductor
export const createDriver = asyncHandler(async (req: Request, res: Response) => {
  try {
    logInfo(`Creando nuevo conductor`);
    logInfo(`Datos recibidos: ${JSON.stringify(req.body)}`);
    
    const { firstName, lastName, cedula, license, phone } = req.body;
    
    if (!firstName || !lastName || !cedula || !license || !phone) {
      logError(new Error('Campos requeridos faltantes'), 'createDriver validation');
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido, cédula, licencia y teléfono son requeridos'
      });
    }
    
    const newDriver = await driverService.createDriver(req.body);
    
    logInfo(`Conductor creado exitosamente: ${newDriver.id}`);
    res.status(201).json({
      success: true,
      message: 'Conductor creado exitosamente',
      data: newDriver
    });
  } catch (error: any) {
    logError(error, `createDriver controller`);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      logError(error, `Prisma P2002 - Duplicate entry for driver creation`);
      return res.status(400).json({
        success: false,
        message: 'Ya existe un conductor con esa cédula o licencia'
      });
    }
    
    // Error general
    logError(error, `General error creating driver`);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el conductor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Actualizar conductor
export const updateDriver = asyncHandler(async (req: Request, res: Response) => {
  try {
    logInfo(`Actualizando conductor ID: ${req.params.id}`);
    logInfo(`Datos de actualización: ${JSON.stringify(req.body)}`);
    
    const updated = await driverService.updateDriver(req.params.id, req.body);
    
    logInfo(`Conductor ${req.params.id} actualizado exitosamente`);
    res.json({
      success: true,
      message: 'Conductor actualizado exitosamente',
      data: updated
    });
  } catch (error: any) {
    logError(error, `updateDriver controller - ID: ${req.params.id}`);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      logError(error, `Prisma P2002 - Duplicate entry for driver ${req.params.id}`);
      return res.status(400).json({
        success: false,
        message: 'Ya existe un conductor con esa cédula o licencia'
      });
    }
    
    if (error.code === 'P2025') {
      logError(error, `Prisma P2025 - Record not found for driver ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Conductor no encontrado'
      });
    }
    
    // Error general
    logError(error, `General error updating driver ${req.params.id}`);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el conductor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Eliminar conductor
export const deleteDriver = asyncHandler(async (req: Request, res: Response) => {
  try {
    logInfo(`Intentando eliminar conductor ID: ${req.params.id}`);
    
    const result = await driverService.deleteDriver(req.params.id);
    
    if (result.canDelete) {
      logInfo(`Conductor ${req.params.id} eliminado exitosamente`);
      res.json({
        success: true,
        message: result.reason
      });
    } else {
      logInfo(`Eliminación cancelada para conductor ${req.params.id}: ${result.reason}`);
      res.status(400).json({
        success: false,
        message: result.reason,
        details: result.details
      });
    }
  } catch (error: any) {
    logError(error, `deleteDriver controller - ID: ${req.params.id}`);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar el conductor'
    });
  }
});

// Buscar conductores
export const searchDrivers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query de búsqueda requerida'
    });
  }
  
  const drivers = await driverService.searchDrivers(query);
  
  res.json({
    success: true,
    data: drivers,
    count: drivers.length
  });
});

// Obtener conductores por estado
export const getDriversByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { statusId } = req.params;
  
  const drivers = await driverService.getDriversByStatus(statusId);
  
  res.json({
    success: true,
    data: drivers,
    count: drivers.length
  });
});

// Obtener estadísticas de conductores
export const getDriverStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await driverService.getDriverStats();
  
  res.json({
    success: true,
    data: stats
  });
});

// Subir foto del conductor
export const uploadDriverPhoto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const photoUrl = req.file?.filename;
  
  if (!photoUrl) {
    return res.status(400).json({
      success: false,
      message: 'No se proporcionó ninguna imagen'
    });
  }
  
  const updatedDriver = await driverService.updateDriver(id, {
    photo: photoUrl
  });
  
  res.json({
    success: true,
    message: 'Foto subida exitosamente',
    data: updatedDriver
  });
});