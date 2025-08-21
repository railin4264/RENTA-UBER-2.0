import { Request, Response } from 'express';
import * as contractService from '../services/contractService';
import { asyncHandler } from '../utils/errorHandler';
import { calculatePenaltyAmount } from '../utils/penalty';

// Obtener todos los contratos
export const getAllContracts = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
  const statusId = req.query.statusId ? String(req.query.statusId) : undefined;
  const driverId = req.query.driverId ? String(req.query.driverId) : undefined;
  const vehicleId = req.query.vehicleId ? String(req.query.vehicleId) : undefined;
  const q = req.query.q ? String(req.query.q) : undefined;
  const from = req.query.from ? String(req.query.from) : undefined;
  const to = req.query.to ? String(req.query.to) : undefined;

  const result = await contractService.listContracts({ page, limit, statusId, driverId, vehicleId, q, from, to });

  res.json({
    success: true,
    data: result.data,
    meta: result.meta
  });
});

// Obtener contrato por ID
export const getContractById = asyncHandler(async (req: Request, res: Response) => {
  const contract = await contractService.getContractById(req.params.id);
  
  if (!contract) {
    return res.status(404).json({
      success: false,
      message: 'Contrato no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: contract
  });
});

// Crear nuevo contrato
export const createContract = asyncHandler(async (req: Request, res: Response) => {
  const { driverId, vehicleId, startDate } = req.body;
  
  if (!driverId || !vehicleId || !startDate) {
    return res.status(400).json({
      success: false,
      message: 'Conductor, vehículo y fecha de inicio son requeridos'
    });
  }
  try {
    const newContract = await contractService.createContract(req.body);
    return res.status(201).json({ success: true, message: 'Contrato creado exitosamente', data: newContract });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creando contrato';
    return res.status(400).json({ success: false, message });
  }
});

// Actualizar contrato
export const updateContract = asyncHandler(async (req: Request, res: Response) => {
  try {
    const updated = await contractService.updateContract(req.params.id, req.body);
    return res.json({ success: true, message: 'Contrato actualizado exitosamente', data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error actualizando contrato';
    return res.status(400).json({ success: false, message });
  }
});

// Eliminar contrato
export const deleteContract = asyncHandler(async (req: Request, res: Response) => {
  await contractService.deleteContract(req.params.id);
  
  res.json({
    success: true,
    message: 'Contrato eliminado exitosamente'
  });
});

// Obtener contratos por conductor
export const getContractsByDriver = asyncHandler(async (req: Request, res: Response) => {
  const { driverId } = req.params;
  
  const contracts = await contractService.getContractsByDriver(driverId);
  
  res.json({
    success: true,
    data: contracts,
    count: contracts.length
  });
});

// Obtener contratos por vehículo
export const getContractsByVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  
  const contracts = await contractService.getContractsByVehicle(vehicleId);
  
  res.json({
    success: true,
    data: contracts,
    count: contracts.length
  });
});

// Obtener contratos por estado
export const getContractsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { statusId } = req.params;
  
  const contracts = await contractService.getContractsByStatus(statusId);
  
  res.json({
    success: true,
    data: contracts,
    count: contracts.length
  });
});

// Obtener contratos activos
export const getActiveContracts = asyncHandler(async (req: Request, res: Response) => {
  const contracts = await contractService.getActiveContracts();
  
  res.json({
    success: true,
    data: contracts,
    count: contracts.length
  });
});

// Obtener contratos por vencer
export const getExpiringContracts = asyncHandler(async (req: Request, res: Response) => {
  const contracts = await contractService.getExpiredContracts();
  
  res.json({ success: true, data: contracts, count: contracts.length });
});

// Obtener estadísticas de contratos
export const getContractStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await contractService.getContractStats();
  
  res.json({
    success: true,
    data: stats
  });
});

// Buscar contratos
export const searchContracts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query de búsqueda requerida'
    });
  }
  
  const contracts = await contractService.searchContracts(query);
  
  res.json({
    success: true,
    data: contracts,
    count: contracts.length
  });
});

// Calculate penalty for a contract (or based on provided payload)
export const calculatePenalty = asyncHandler(async (req: Request, res: Response) => {
  const { base, penaltyRate, daysLate, allowedDelayDays = 0 } = req.body;
  if (typeof base !== 'number' || typeof penaltyRate !== 'number' || typeof daysLate !== 'number') {
    return res.status(400).json({ success: false, message: 'base, penaltyRate and daysLate are required and must be numbers' });
  }

  const amount = calculatePenaltyAmount(base, penaltyRate, daysLate, allowedDelayDays);
  res.json({ success: true, data: { penalty: amount } });
});

// Download contract PDF (stub)
export const downloadContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // For now return a small PDF-like placeholder or plain text with attachment header
  const content = `Contrato ${id}\nGenerado: ${new Date().toISOString()}`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=contract-${id}.pdf`);
  // stream plain text as PDF placeholder
  res.send(Buffer.from(content));
});