import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';
import { asyncHandler } from '../utils/errorHandler';

// Obtener todos los vehículos
export const getAllVehicles = asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await vehicleService.getAllVehicles();
  
  res.json({
    success: true,
    data: vehicles,
    count: vehicles.length
  });
});

// Obtener vehículo por ID
export const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehículo no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: vehicle
  });
});

// Crear nuevo vehículo
export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { model, plate } = req.body;
  
  if (!model || !plate) {
    return res.status(400).json({
      success: false,
      message: 'Modelo y placa son requeridos'
    });
  }
  
  const newVehicle = await vehicleService.createVehicle(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Vehículo creado exitosamente',
    data: newVehicle
  });
});

// Actualizar vehículo
export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const updated = await vehicleService.updateVehicle(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Vehículo actualizado exitosamente',
    data: updated
  });
});

// Eliminar vehículo
export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  await vehicleService.deleteVehicle(req.params.id);
  
  res.json({
    success: true,
    message: 'Vehículo eliminado exitosamente'
  });
});

// Buscar vehículos
export const searchVehicles = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query de búsqueda requerida'
    });
  }
  
  const vehicles = await vehicleService.searchVehicles(query);
  
  res.json({
    success: true,
    data: vehicles,
    count: vehicles.length
  });
});

// Obtener vehículos por estado
export const getVehiclesByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { statusId } = req.params;
  
  const vehicles = await vehicleService.getVehiclesByStatus(statusId);
  
  res.json({
    success: true,
    data: vehicles,
    count: vehicles.length
  });
});

// Obtener estadísticas de vehículos
export const getVehicleStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await vehicleService.getVehicleStats();
  
  res.json({
    success: true,
    data: stats
  });
});

// Obtener vehículos en mantenimiento
export const getVehiclesInMaintenance = asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await vehicleService.getVehiclesInMaintenance();
  
  res.json({
    success: true,
    data: vehicles,
    count: vehicles.length
  });
});

// Subir foto del vehículo
export const uploadVehiclePhoto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const photoUrl = req.file?.filename;
  
  if (!photoUrl) {
    return res.status(400).json({
      success: false,
      message: 'No se proporcionó ninguna imagen'
    });
  }
  
  const updatedVehicle = await vehicleService.updateVehicle(id, {
    photos: photoUrl
  });
  
  res.json({
    success: true,
    message: 'Foto subida exitosamente',
    data: updatedVehicle
  });
});