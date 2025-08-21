import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';
import { asyncHandler } from '../utils/errorHandler';

// Obtener todos los pagos
export const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments();
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Obtener pago por ID
export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pago no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: payment
  });
});

// Crear nuevo pago
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { driverId, amount, type, date } = req.body;
  
  if (!driverId || !amount || !type || !date) {
    return res.status(400).json({
      success: false,
      message: 'Conductor, monto, tipo y fecha son requeridos'
    });
  }
  
  const newPayment = await paymentService.createPayment(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Pago creado exitosamente',
    data: newPayment
  });
});

// Actualizar pago
export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const updated = await paymentService.updatePayment(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Pago actualizado exitosamente',
    data: updated
  });
});

// Eliminar pago
export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  await paymentService.deletePayment(req.params.id);
  
  res.json({
    success: true,
    message: 'Pago eliminado exitosamente'
  });
});

// Obtener pagos por conductor
export const getPaymentsByDriver = asyncHandler(async (req: Request, res: Response) => {
  const { driverId } = req.params;
  
  const payments = await paymentService.getPaymentsByDriver(driverId);
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Obtener pagos por contrato
export const getPaymentsByContract = asyncHandler(async (req: Request, res: Response) => {
  const { contractId } = req.params;
  
  const payments = await paymentService.getPaymentsByContract(contractId);
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Obtener pagos por estado
export const getPaymentsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;
  
  const payments = await paymentService.getPaymentsByStatus(status);
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Obtener pagos por tipo
export const getPaymentsByType = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;
  
  const payments = await paymentService.getPaymentsByType(type);
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Obtener estadísticas de pagos
export const getPaymentStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await paymentService.getPaymentStats();
  
  res.json({
    success: true,
    data: stats
  });
});

// Obtener pagos mensuales
export const getMonthlyPayments = asyncHandler(async (req: Request, res: Response) => {
  const { year, month } = req.params;
  
  const payments = await paymentService.getMonthlyPayments(parseInt(year), parseInt(month));
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});

// Buscar pagos
export const searchPayments = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query de búsqueda requerida'
    });
  }
  
  const payments = await paymentService.searchPayments(query);
  
  res.json({
    success: true,
    data: payments,
    count: payments.length
  });
});