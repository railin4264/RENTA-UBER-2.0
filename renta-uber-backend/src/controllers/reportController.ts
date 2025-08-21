import { Request, Response } from 'express';
import * as reportService from '../services/reportService';
import { asyncHandler } from '../utils/errorHandler';

// Obtener todos los reportes
export const getAllReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await reportService.getAllReports();
  
  res.json({
    success: true,
    data: reports,
    count: reports.length
  });
});

// Obtener reporte por ID
export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getReportById(req.params.id);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Reporte no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: report
  });
});

// Crear nuevo reporte
export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, data } = req.body;
  
  if (!title || !description || !data) {
    return res.status(400).json({
      success: false,
      message: 'Título, descripción y datos son requeridos'
    });
  }
  
  const newReport = await reportService.createReport(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Reporte creado exitosamente',
    data: newReport
  });
});

// Eliminar reporte
export const deleteReport = asyncHandler(async (req: Request, res: Response) => {
  await reportService.deleteReport(req.params.id);
  
  res.json({
    success: true,
    message: 'Reporte eliminado exitosamente'
  });
});

// Generar reporte financiero
export const generateFinancialReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de inicio y fin son requeridas'
    });
  }
  
  const report = await reportService.generateFinancialReport(
    new Date(startDate as string),
    new Date(endDate as string)
  );
  
  res.json({
    success: true,
    data: report
  });
});

// Generar reporte de conductor
export const generateDriverReport = asyncHandler(async (req: Request, res: Response) => {
  const { driverId } = req.params;
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de inicio y fin son requeridas'
    });
  }
  
  const report = await reportService.generateDriverReport(
    driverId,
    new Date(startDate as string),
    new Date(endDate as string)
  );
  
  res.json({
    success: true,
    data: report
  });
});

// Generar reporte de vehículo
export const generateVehicleReport = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de inicio y fin son requeridas'
    });
  }
  
  const report = await reportService.generateVehicleReport(
    vehicleId,
    new Date(startDate as string),
    new Date(endDate as string)
  );
  
  res.json({
    success: true,
    data: report
  });
});

// Generar reporte de mantenimiento
export const generateMaintenanceReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.generateMaintenanceReport();
  
  res.json({
    success: true,
    data: report
  });
});

// Generar reporte de pagos
export const generatePaymentReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de inicio y fin son requeridas'
    });
  }
  
  const report = await reportService.generatePaymentReport(
    new Date(startDate as string),
    new Date(endDate as string)
  );
  
  res.json({
    success: true,
    data: report
  });
});

// Generar reporte del dashboard
export const generateDashboardReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.generateDashboardReport();
  
  res.json({
    success: true,
    data: report
  });
});